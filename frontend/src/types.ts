export interface AutopsyReport {
  CaseNumber: string
  ErrorType: string
  ErrorMessage: string
  Language: string
  Location: string
  Severity: number
  Biography: string
  CauseOfDeath: string
  Epitaph: string
  RecommendedBurial: string
  RecommendedBurialNote: string
}

export interface Tributes {
  Incense: number
  Flowers: number
  Paper: number
}

export interface BugRecord {
  Id: number
  ErrorType: string
  ErrorMessage: string
  Language: string
  Location: string
  Biography: string
  CauseOfDeath: string
  Epitaph: string
  Severity: number
  BurialType: string
  Tributes: Tributes
  CreatedAt: string
}

export interface LanguageStat {
  Language: string
  Count: number
}

export interface BurialTypeStat {
  BurialType: string
  Count: number
}

export interface AnnualStats {
  TotalBuried: number
  TodayBuried: number
  TotalIncense: number
  TotalFlowers: number
  TotalPaper: number
  TopErrorType: string
  TopKillerLanguage: string
  ByLanguage: LanguageStat[]
  ByBurialType: BurialTypeStat[]
  RecentBugs: BugRecord[]
}

export type BurialType = 'earth' | 'fire' | 'sea'

export interface BurialOption {
  key: BurialType
  name: string
  desc: string
  icon: string
}