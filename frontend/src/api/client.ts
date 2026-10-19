import type { AnnualStats, AutopsyReport, BugRecord, BurialType } from '../types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!resp.ok) {
    const body = await resp.json().catch(() => null)
    throw new Error((body && body.detail) || `请求失败 (${resp.status})`)
  }
  return resp.json() as Promise<T>
}

export function autopsy(stack: string): Promise<AutopsyReport> {
  return request<AutopsyReport>('/api/v1/autopsies', {
    method: 'POST',
    body: JSON.stringify({ Stack: stack }),
  })
}

export function buryBug(report: AutopsyReport, burialType: BurialType, stack: string): Promise<BugRecord> {
  const payload = {
    ErrorType: report.ErrorType,
    ErrorMessage: report.ErrorMessage,
    Language: report.Language,
    Location: report.Location,
    StackExcerpt: stack.slice(0, 1000),
    Biography: report.Biography,
    CauseOfDeath: report.CauseOfDeath,
    Epitaph: report.Epitaph,
    Severity: report.Severity,
    BurialType: burialType,
  }
  return request<BugRecord>('/api/v1/bugs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function listBugs(limit = 60): Promise<BugRecord[]> {
  return request<BugRecord[]>(`/api/v1/bugs?limit=${limit}`)
}

export function payTribute(bugId: number, type: 'incense' | 'flower' | 'paper'): Promise<BugRecord> {
  return request<BugRecord>(`/api/v1/bugs/${bugId}/tributes`, {
    method: 'POST',
    body: JSON.stringify({ Type: type }),
  })
}

export function annualReport(): Promise<AnnualStats> {
  return request<AnnualStats>('/api/v1/stats/annual')
}