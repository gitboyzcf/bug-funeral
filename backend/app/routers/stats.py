from fastapi import APIRouter

from app.database import get_conn
from app.routers.bugs import row_to_record
from app.schemas import AnnualStats, BurialTypeStat, LanguageStat

router = APIRouter(prefix="/api/v1/stats", tags=["stats"])

FULL_FIELDS = (
    "id, error_type, error_message, language, location, biography, cause_of_death, "
    "epitaph, severity, burial_type, incense_count, flower_count, paper_count, created_at"
)

BURIAL_NAMES = {"earth": "土葬", "fire": "火葬", "sea": "海葬"}


@router.get("/annual", response_model=AnnualStats)
def annual_report():
    conn = get_conn()
    try:
        total = conn.execute("SELECT COUNT(*) AS c FROM bugs").fetchone()["c"]
        today = conn.execute(
            "SELECT COUNT(*) AS c FROM bugs WHERE date(created_at) = date('now', 'localtime')"
        ).fetchone()["c"]
        incense = conn.execute("SELECT COALESCE(SUM(incense_count), 0) AS s FROM bugs").fetchone()["s"]
        flowers = conn.execute("SELECT COALESCE(SUM(flower_count), 0) AS s FROM bugs").fetchone()["s"]
        paper = conn.execute("SELECT COALESCE(SUM(paper_count), 0) AS s FROM bugs").fetchone()["s"]

        by_language_rows = conn.execute(
            "SELECT language AS lang, COUNT(*) AS c FROM bugs GROUP BY language ORDER BY c DESC"
        ).fetchall()
        by_burial_rows = conn.execute(
            "SELECT burial_type AS b, COUNT(*) AS c FROM bugs GROUP BY burial_type ORDER BY c DESC"
        ).fetchall()
        top_error_row = conn.execute(
            "SELECT error_type, COUNT(*) AS c FROM bugs GROUP BY error_type ORDER BY c DESC LIMIT 1"
        ).fetchone()

        recent_rows = conn.execute(
            f"SELECT {FULL_FIELDS} FROM bugs ORDER BY id DESC LIMIT 10"
        ).fetchall()

        by_language = [LanguageStat(Language=r["lang"], Count=r["c"]) for r in by_language_rows]
        by_burial = [
            BurialTypeStat(BurialType=BURIAL_NAMES.get(r["b"], r["b"]), Count=r["c"]) for r in by_burial_rows
        ]

        return AnnualStats(
            TotalBuried=total,
            TodayBuried=today,
            TotalIncense=incense,
            TotalFlowers=flowers,
            TotalPaper=paper,
            TopErrorType=top_error_row["error_type"] if top_error_row else "暂无阵亡记录",
            TopKillerLanguage=by_language[0].Language if by_language else "暂无",
            ByLanguage=by_language,
            ByBurialType=by_burial,
            RecentBugs=[row_to_record(r) for r in recent_rows],
        )
    finally:
        conn.close()