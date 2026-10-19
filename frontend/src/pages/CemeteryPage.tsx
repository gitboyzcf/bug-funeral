import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBugs } from '../api/client'
import Tombstone from '../components/Tombstone'
import type { BugRecord } from '../types'

export default function CemeteryPage() {
  const [bugs, setBugs] = useState<BugRecord[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setBugs(await listBugs(60))
    } catch (e) {
      setError(e instanceof Error ? e.message : '墓园大门打不开了')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="wrap">
      <section className="hero">
        <h1>
          全球 <span className="hl">Bug 公共墓园</span>
        </h1>
        <p className="sub">它们死于代码评审、死于上线前夜、死于一次手滑的 force push · 给它们上一炷香吧</p>
      </section>

      <section>
        {error && <div className="error-msg">{error}</div>}
        {bugs === null && !error && (
          <div className="loading">正在推开墓园大门<span className="dots"></span></div>
        )}
        {bugs && bugs.length === 0 && (
          <div className="cemetery-empty">
            <p style={{ fontSize: 18, fontWeight: 800 }}>墓园还是空的</p>
            <p style={{ marginTop: 10 }}>
              去 <Link to="/" style={{ color: 'var(--purple-d)' }}>接待处</Link> 送一只 Bug 进来吧
            </p>
          </div>
        )}
        {bugs && bugs.length > 0 && (
          <div className="cemetery-grid">
            {bugs.map((bug) => (
              <div key={bug.Id} className="cemetery-item">
                <Tombstone bug={bug} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}