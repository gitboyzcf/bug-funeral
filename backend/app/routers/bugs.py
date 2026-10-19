from fastapi import APIRouter, HTTPException

from app.database import get_conn
from app.schemas import BugRecord, BurialRequest, TributeRequest, Tributes

router = APIRouter(prefix="/api/v1/bugs", tags=["bugs"])

INSERT_SQL = """
INSERT INTO bugs (error_type, error_message, language, location, stack_excerpt,
                  biography, cause_of_death, epitaph, severity, burial_type)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

ROW_TO_RECORD_FIELDS = (
    "id, error_type, error_message, language, location, biography, cause_of_death, "
    "epitaph, severity, burial_type, incense_count, flower_count, paper_count, created_at"
)


def row_to_record(row) -> BugRecord:
    return BugRecord(
        Id=row["id"],
        ErrorType=row["error_type"],
        ErrorMessage=row["error_message"],
        Language=row["language"],
        Location=row["location"],
        Biography=row["biography"],
        CauseOfDeath=row["cause_of_death"],
        Epitaph=row["epitaph"],
        Severity=row["severity"],
        BurialType=row["burial_type"],
        Tributes=Tributes(Incense=row["incense_count"], Flowers=row["flower_count"], Paper=row["paper_count"]),
        CreatedAt=row["created_at"],
    )


@router.post("", response_model=BugRecord, status_code=201)
def bury_bug(req: BurialRequest):
    conn = get_conn()
    try:
        cursor = conn.execute(
            INSERT_SQL,
            (req.ErrorType, req.ErrorMessage, req.Language, req.Location, req.StackExcerpt[:1000],
             req.Biography, req.CauseOfDeath, req.Epitaph, req.Severity, req.BurialType),
        )
        conn.commit()
        row = conn.execute(
            f"SELECT {ROW_TO_RECORD_FIELDS} FROM bugs WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
        return row_to_record(row)
    finally:
        conn.close()


@router.get("", response_model=list[BugRecord])
def list_bugs(limit: int = 60, offset: int = 0):
    conn = get_conn()
    try:
        rows = conn.execute(
            f"SELECT {ROW_TO_RECORD_FIELDS} FROM bugs ORDER BY id DESC LIMIT ? OFFSET ?",
            (min(limit, 200), offset),
        ).fetchall()
        return [row_to_record(row) for row in rows]
    finally:
        conn.close()


@router.get("/{bug_id}", response_model=BugRecord)
def get_bug(bug_id: int):
    conn = get_conn()
    try:
        row = conn.execute(
            f"SELECT {ROW_TO_RECORD_FIELDS} FROM bugs WHERE id = ?", (bug_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="墓碑不存在，它可能已经转世")
        return row_to_record(row)
    finally:
        conn.close()


TRIBUTE_COLUMN = {"incense": "incense_count", "flower": "flower_count", "paper": "paper_count"}


@router.post("/{bug_id}/tributes", response_model=BugRecord)
def pay_tribute(bug_id: int, req: TributeRequest):
    column = TRIBUTE_COLUMN[req.Type]
    conn = get_conn()
    try:
        conn.execute(f"UPDATE bugs SET {column} = {column} + 1 WHERE id = ?", (bug_id,))
        conn.commit()
        row = conn.execute(
            f"SELECT {ROW_TO_RECORD_FIELDS} FROM bugs WHERE id = ?", (bug_id,)
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="墓碑不存在，它可能已经转世")
        return row_to_record(row)
    finally:
        conn.close()