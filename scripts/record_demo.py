import time
from playwright.sync_api import sync_playwright

STACK = '''Traceback (most recent call last):
  File "payment_service.py", line 87, in charge_order
    result = gateway.refund(order_id)
  File "gateway/client.py", line 142, in refund
    conn = pool.acquire(timeout=3)
  File "pool.py", line 56, in acquire
    return self._connections[None]
IndexError: list index out of range'''


def scroll_slow(page, to_y, step=400, pause=0.35):
    current = page.evaluate("window.scrollY")
    direction = 1 if to_y > current else -1
    y = current
    while (direction == 1 and y < to_y) or (direction == -1 and y > to_y):
        y += direction * step
        page.evaluate(f"window.scrollTo(0, {y})")
        time.sleep(pause)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            record_video_dir="recordings",
            record_video_size={"width": 1280, "height": 800},
        )
        page = context.new_page()
        page.goto("http://localhost:8088/", wait_until="networkidle")
        time.sleep(18)

        scroll_slow(page, 500)
        time.sleep(12)

        page.get_by_text("试试示例逝者").click()
        time.sleep(9)

        page.get_by_text("送入验尸房").click()
        page.get_by_text("生前生平", exact=False).first.wait_for(state="visible", timeout=20000)
        time.sleep(12)

        scroll_slow(page, 900)
        time.sleep(12)
        scroll_slow(page, 1500)
        time.sleep(12)

        page.get_by_text("选择葬礼规格").wait_for(state="visible", timeout=20000)
        scroll_slow(page, page.evaluate("document.body.scrollHeight"))
        time.sleep(14)

        page.get_by_text("选择火葬").click()
        time.sleep(9)

        page.get_by_text("下葬完成").wait_for(state="visible", timeout=20000)
        scroll_slow(page, 0)
        time.sleep(18)

        page.get_by_text("前往墓园探望").click()
        page.wait_for_url("**/cemetery", timeout=15000)
        time.sleep(14)

        page.get_by_text("上香").first.click()
        time.sleep(9)
        page.get_by_text("献花").first.click()
        time.sleep(9)
        page.get_by_text("烧纸").first.click()
        time.sleep(12)

        page.get_by_text("殉职年报").click()
        page.wait_for_url("**/annual", timeout=15000)
        page.get_by_text("累计安葬", exact=False).first.wait_for(state="visible", timeout=15000)
        time.sleep(12)

        scroll_slow(page, 800)
        time.sleep(9)
        scroll_slow(page, 1600)
        time.sleep(9)
        scroll_slow(page, 0)
        time.sleep(14)

        video = page.video
        context.close()
        path = video.path()
        browser.close()
        print(f"VIDEO_SAVED: {path}")


if __name__ == "__main__":
    main()