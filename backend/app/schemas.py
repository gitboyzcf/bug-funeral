from pydantic import BaseModel, Field


class AutopsyRequest(BaseModel):
    Stack: str = Field(min_length=1, max_length=20000)


class AutopsyReport(BaseModel):
    CaseNumber: str
    ErrorType: str
    ErrorMessage: str
    Language: str
    Location: str
    Severity: int
    Biography: str
    CauseOfDeath: str
    Epitaph: str
    RecommendedBurial: str
    RecommendedBurialNote: str


class BurialRequest(BaseModel):
    ErrorType: str
    ErrorMessage: str = ""
    Language: str
    Location: str = ""
    StackExcerpt: str = ""
    Biography: str = ""
    CauseOfDeath: str = ""
    Epitaph: str = ""
    Severity: int = 3
    BurialType: str = Field(pattern="^(earth|fire|sea)$")


class Tributes(BaseModel):
    Incense: int
    Flowers: int
    Paper: int


class BugRecord(BaseModel):
    Id: int
    ErrorType: str
    ErrorMessage: str
    Language: str
    Location: str
    Biography: str
    CauseOfDeath: str
    Epitaph: str
    Severity: int
    BurialType: str
    Tributes: Tributes
    CreatedAt: str


class TributeRequest(BaseModel):
    Type: str = Field(pattern="^(incense|flower|paper)$")


class LanguageStat(BaseModel):
    Language: str
    Count: int


class BurialTypeStat(BaseModel):
    BurialType: str
    Count: int


class AnnualStats(BaseModel):
    TotalBuried: int
    TodayBuried: int
    TotalIncense: int
    TotalFlowers: int
    TotalPaper: int
    TopErrorType: str
    TopKillerLanguage: str
    ByLanguage: list[LanguageStat]
    ByBurialType: list[BurialTypeStat]
    RecentBugs: list[BugRecord]