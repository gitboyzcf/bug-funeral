import hashlib
import json
import random
import re
import urllib.request

from app.config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL, LLM_TIMEOUT_SECONDS

CRIME_PATTERNS = [
    (r"null|none|undefined|nullpointer", [
        "生前最爱在深夜生产 null，见谁都要问一句「你存在吗」",
        "坚信「万物皆可为 null」，并用一生身体力行地证明了这一点",
        "一生引用过三千次未定义变量，没有一次成功",
    ]),
    (r"timeout|timed?\s*out|超时", [
        "承诺三秒内返回，却永远留在了连接池，成为全队等待时间最长的男人",
        "一生都在等待响应，直到自己也变成了别人等待的响应",
    ]),
    (r"connection|refused|network|socket|econnrefused", [
        "社交牛逼症晚期，见谁都想握手，最终被全世界 RESET",
        "一生连接过三千个端口，没有一个端口记得它的名字",
    ]),
    (r"index|bounds|range|out\s*of", [
        "数学不好，总把第 0 个当第 1 个，一生都在数组边界之外流浪",
        "坚信数组之外还有更大的世界，出发后就再也没能回来",
    ]),
    (r"memory|heap|oom|outofmemory", [
        "囤积癖晚期，见内存就想 new，从不归还，最终撑死于堆中，享年 512M",
        "一生只进不出，被誉为「内存界的貔貅」，最终把自己撑爆了",
    ]),
    (r"syntax|parse|compile|编译|语法", [
        "还没出生就写错了，胎死于第 42 列，享年：编译期 0.3 秒",
        "尸检发现它的括号少了一半，法医表示无法缝合",
    ]),
    (r"permission|forbidden|403|401|auth|denied", [
        "翻墙爱好者，一生越权无数，最终死在 403 禁区，无人认领",
        "一辈子都在问「我有权限吗」，最后一次终于问对了，也走到了尽头",
    ]),
    (r"division|zero|除零", [
        "坚信除数可以为零，用生命验证了小学数学老师的警告",
    ]),
    (r"deadlock|lock|mutex|死锁", [
        "和另一个线程相看两厌又互不放手，双双殉情于互斥锁",
    ]),
    (r"sql|database|sqlite|mysql", [
        "一生只会写 SELECT *，最终被一张千万行的大表拖垮了",
    ]),
]

UNKNOWN_CRIMES = [
    "身份不明的流浪 bug，尸检时连异常类型都不愿意透露",
    "卒因成谜，法医在它的堆栈里只找到一片空白和一声叹息",
]

EPITAPHS = [
    "此处安葬着一个声称「在我机器上是好的」的 Bug",
    "它只是想正常运行，谁也没想到会是这个结局",
    "生而为 Bug，我很抱歉",
    "commit 记录已清空，感谢它从未进入主干分支",
    "愿它在生产环境之外，永远不再被唤醒",
    "它死于一次 review，却被记成了 typo",
    "迟到三周的 fix，没能赶上它的葬礼",
    "这里躺着一个 try/except 没接住的灵魂",
    "「改这一行就好了」——它的遗言，也是它的死因",
    "一路走好，下辈子投胎当个 Feature",
]

CAUSE_TEMPLATES = [
    "直接死因：{message}。法医鉴定：这不是意外，是自杀式部署",
    "直接死因：{message}。鉴定结论：死于他人之手，但凶手已删除现场",
    "直接死因：{message}。鉴定结论：自然死亡，寿终于垃圾回收之前",
]

BURIAL_BY_CRIME = {
    "memory": "fire",
    "connection": "sea",
    "network": "sea",
    "syntax": "earth",
}

BURIAL_NOTES = {
    "earth": "入土为安，注释里封印，永世不得编译",
    "fire": "烧了最干净，一把火防止转世投胎",
    "sea": "网络 bug 归于大海，随波逐流，永不重连",
}

BURIAL_NAMES = {
    "earth": "土葬",
    "fire": "火葬",
    "sea": "海葬",
}


def detect_language(stack: str) -> str:
    if "Traceback (most recent call last)" in stack:
        return "Python"
    if re.search(r"\bat [\w$.]+\([\w+.]+:\d+\)|Caused by:", stack) or re.search(r"\bat [\w$.]+\.(\w+)\(", stack):
        return "Java"
    if re.search(r"at .+ \(.*:\d+:\d+\)|Cannot read propert", stack):
        return "JavaScript"
    if "panic:" in stack or "goroutine" in stack:
        return "Go"
    if "segmentation fault" in stack.lower() or "#include" in stack:
        return "C/C++"
    return "未知物种"


def detect_error_type(stack: str) -> str:
    python_match = re.findall(r"^([\w.]+(?:Error|Exception|Warning|Interrupt))(?::|$)", stack, re.MULTILINE)
    if python_match:
        return python_match[-1].split(".")[-1]
    panic_match = re.search(r"panic:\s*(.+)", stack)
    if panic_match:
        return panic_match.group(1).strip()[:80]
    matches = re.findall(r"\b(\w*(?:Error|Exception|Fault|Panic|Timeout)\w*)\b", stack)
    if matches:
        return max(set(matches), key=matches.count)
    return "死因不明"


def detect_location(stack: str, language: str) -> str:
    py_match = re.findall(r'File "([^"]+)", line (\d+)', stack)
    if py_match:
        file, line = py_match[-1]
        return f"{file} 第 {line} 行"
    go_match = re.findall(r"(\S+\.go):(\d+)", stack)
    if go_match:
        file, line = go_match[-1]
        return f"{file} 第 {line} 行"
    js_match = re.findall(r"([^\s(/]+):(\d+):(\d+)", stack)
    if js_match and language != "未知物种":
        file, line, _ = js_match[-1]
        return f"{file} 第 {line} 行"
    java_match = re.findall(r"\((\w+\.java):(\d+)\)", stack)
    if java_match:
        file, line = java_match[-1]
        return f"{file} 第 {line} 行"
    return "案发现场不明"


def detect_severity(stack: str, error_type: str) -> int:
    severity = 3
    lowered = stack.lower()
    if any(k in lowered for k in ["production", "prod", "上线", "凌晨", "master", "main"]):
        severity += 2
    if any(k in lowered for k in ["payment", "money", "order", "支付", "订单"]):
        severity += 1
    if "test" in lowered:
        severity -= 1
    if len(stack) > 3000:
        severity += 1
    if error_type in ("死因不明",):
        severity -= 1
    return max(1, min(5, severity))


def pick_crime(stack: str, error_type: str, rng: random.Random) -> str:
    haystack = (stack + " " + error_type).lower()
    candidates = []
    for pattern, crimes in CRIME_PATTERNS:
        if re.search(pattern, haystack):
            candidates.extend(crimes)
    if not candidates:
        candidates = UNKNOWN_CRIMES
    return rng.choice(candidates)


def build_prompt(stack: str, error_type: str, language: str, location: str) -> str:
    return (
        "你是一位赛博殡仪馆的黑幽默验尸官。下面是一段程序报错堆栈，请用中文为这个 bug 写：\n"
        "1. Biography（生前生平，60字内，讲它生前作恶的事迹，程序员冷幽默风格）\n"
        "2. CauseOfDeath（死因鉴定，50字内，模仿法医报告口吻）\n"
        "3. Epitaph（墓志铭，40字内，一句话）\n"
        "只输出 JSON：{\"Biography\": \"...\", \"CauseOfDeath\": \"...\", \"Epitaph\": \"...\"}\n\n"
        f"语言：{language}\n异常类型：{error_type}\n位置：{location}\n堆栈：\n{stack[:2000]}"
    )


def try_llm(stack: str, error_type: str, language: str, location: str):
    if not (LLM_BASE_URL and LLM_API_KEY and LLM_MODEL):
        return None
    try:
        payload = json.dumps({
            "model": LLM_MODEL,
            "messages": [{"role": "user", "content": build_prompt(stack, error_type, language, location)}],
            "temperature": 0.9,
        }).encode("utf-8")
        req = urllib.request.Request(
            LLM_BASE_URL.rstrip("/") + "/chat/completions",
            data=payload,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {LLM_API_KEY}"},
        )
        with urllib.request.urlopen(req, timeout=LLM_TIMEOUT_SECONDS) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            content = re.sub(r"^```json|```$", "", content.strip(), flags=re.MULTILINE).strip()
            parsed = json.loads(content)
            if all(k in parsed for k in ("Biography", "CauseOfDeath", "Epitaph")):
                return parsed
    except Exception:
        return None
    return None


def conduct_autopsy(stack: str) -> dict:
    seed = int(hashlib.md5(stack.encode("utf-8")).hexdigest(), 16) % (2 ** 32)
    rng = random.Random(seed)

    language = detect_language(stack)
    error_type = detect_error_type(stack)
    location = detect_location(stack, language)
    severity = detect_severity(stack, error_type)
    crime = pick_crime(stack, error_type, rng)
    epitaph = rng.choice(EPITAPHS)
    message = error_type
    msg_match = re.search(r"(?:Error|Exception|Panic|Fault)[\w]*:\s*(.+)", stack)
    if msg_match:
        message = msg_match.group(1).strip()[:120]
    cause = rng.choice(CAUSE_TEMPLATES).format(message=message)

    recommended = BURIAL_BY_CRIME.get(next(
        (p for p, _ in CRIME_PATTERNS if re.search(p, (stack + " " + error_type).lower())), ""), rng.choice(["earth", "fire", "sea"]))

    llm_result = try_llm(stack, error_type, language, location)
    if llm_result:
        biography = llm_result["Biography"]
        cause = llm_result["CauseOfDeath"]
        epitaph = llm_result["Epitaph"]
    else:
        biography = crime

    return {
        "ErrorType": error_type,
        "ErrorMessage": message,
        "Language": language,
        "Location": location,
        "Severity": severity,
        "Biography": biography,
        "CauseOfDeath": cause,
        "Epitaph": epitaph,
        "RecommendedBurial": recommended,
        "RecommendedBurialNote": BURIAL_NOTES[recommended],
        "CaseNumber": f"BF-{seed % 100000:05d}",
    }