import { useEffect, useState } from 'react'
import { annualReport } from '../api/client'
import StatCard from '../components/StatCard'
import type { AnnualStats } from '../types'

export default function AnnualReportPage() {
  const [stats, setStats] = useState<AnnualStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    annualReport()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : '年报被压在数据库下面了'))
  }, [])

  const maxLang = stats ? Math.max(...stats.ByLanguage.map((l) => l.Count), 1) : 1
  const maxBurial = stats ? Math.max(...stats.ByBurialType.map((b) => b.Count), 1) : 1

  return (
    <div className="wrap">
      <section className="hero">
        <h1>
          Bug <span className="hl">殉职年报</span>
        </h1>
        <p className="sub">本殡仪馆安葬业绩公开 · 数据实时来自全球墓园</p>
      </section>

      <section>
        {error && <div className="error-msg">{error}</div>}
        {stats === null && !error && (
          <div className="loading">统计科正在翻账本<span className="dots"></span></div>
        )}
        {stats && (
          <>
            <div className="stat-grid">
              <StatCard num={stats.TotalBuried} label="累计安葬 BUG" />
              <StatCard num={stats.TodayBuried} label="今日新增阵亡" />
              <StatCard num={stats.TotalIncense} label="累计香火" />
              <StatCard num={stats.TotalFlowers} label="累计鲜花" />
              <StatCard num={stats.TotalPaper} label="累计纸钱" />
              <StatCard num={stats.TopErrorType} label="头号死因" />
            </div>

            <div className="s-head">
              <h2>阵亡语种分布</h2>
              <span className="en">BY LANGUAGE</span>
            </div>
            <div style={{ marginBottom: 40 }}>
              {stats.ByLanguage.map((l) => (
                <div key={l.Language} className="bar-row">
                  <div className="bar-label">{l.Language}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(l.Count / maxLang) * 100}%` }} />
                  </div>
                  <div className="bar-num">{l.Count}</div>
                </div>
              ))}
            </div>

            <div className="s-head">
              <h2>葬法分布</h2>
              <span className="en">BY BURIAL</span>
            </div>
            <div style={{ marginBottom: 40 }}>
              {stats.ByBurialType.map((b) => (
                <div key={b.BurialType} className="bar-row">
                  <div className="bar-label">{b.BurialType}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(b.Count / maxBurial) * 100}%` }} />
                  </div>
                  <div className="bar-num">{b.Count}</div>
                </div>
              ))}
            </div>

            <div className="s-head">
              <h2>今日死亡榜</h2>
              <span className="en">RECENT DEATHS</span>
            </div>
            <div className="death-list">
              {stats.RecentBugs.map((bug, i) => (
                <div key={bug.Id} className="death-row">
                  <span className="idx">No.{i + 1}</span>
                  <span className="err">{bug.ErrorType} — {bug.Epitaph}</span>
                  <span className="meta">
                    {bug.Language} · {bug.BurialType} · {bug.CreatedAt}
                  </span>
                </div>
              ))}
              {stats.RecentBugs.length === 0 && (
                <div className="death-row">
                  <span className="err" style={{ color: 'var(--muted)' }}>
                    暂无阵亡记录，功德 +1 的机会留给你
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}