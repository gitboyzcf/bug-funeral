import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { autopsy, buryBug } from '../api/client'
import AutopsyReportView from '../components/AutopsyReport'
import BugForm from '../components/BugForm'
import BurialEffect from '../components/BurialEffect'
import BurialPicker from '../components/BurialPicker'
import Tombstone from '../components/Tombstone'
import type { AutopsyReport, BugRecord, BurialType } from '../types'

export default function ReceptionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<AutopsyReport | null>(null)
  const [stack, setStack] = useState('')
  const [burying, setBurying] = useState(false)
  const [pendingType, setPendingType] = useState<BurialType>('earth')
  const [buried, setBuried] = useState<BugRecord | null>(null)

  const handleEffectDone = useCallback(() => {}, [])

  const handleSubmit = useCallback(async (input: string) => {
    setLoading(true)
    setError('')
    try {
      const result = await autopsy(input)
      setStack(input)
      setReport(result)
      setBuried(null)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } catch (e) {
      setError(e instanceof Error ? e.message : '验尸失败，逝者拒绝配合')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChoose = useCallback(
    async (type: BurialType) => {
      if (!report) return
      setPendingType(type)
      setBurying(true)
      try {
        const record = await buryBug(report, type, stack)
        setBuried(record)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (e) {
        setError(e instanceof Error ? e.message : '下葬失败')
      } finally {
        setBurying(false)
      }
    },
    [report, stack],
  )

  return (
    <>
      {burying && report && <BurialEffect type={pendingType} errorType={report.ErrorType} onDone={handleEffectDone} />}
      <div className="wrap">
        <section className="hero">
          <h1>
            世界不需要又一个 <span className="hl">CRUD</span>，
            <br />
            但每个 Bug 都值得一场体面的葬礼
          </h1>
          <p className="sub">
            BUG 殡仪馆 · AI 验尸官 7×24 接诊 · 三种葬法 · 全球墓园 · 祭拜不朽
          </p>
        </section>

        <section>
          <BugForm onSubmit={handleSubmit} loading={loading} />
          {error && <div className="error-msg">法医科退件：{error}</div>}
          {loading && <div className="loading">验尸官正在解剖堆栈<span className="dots"></span></div>}
        </section>

        {report && !burying && (
          <section>
            <AutopsyReportView report={report} />
          </section>
        )}

        {report && !burying && !buried && (
          <section>
            <BurialPicker
              recommended={report.RecommendedBurial}
              note={report.RecommendedBurialNote}
              disabled={burying}
              onChoose={handleChoose}
            />
          </section>
        )}

        {buried && (
          <section>
            <div className="s-head">
              <h2>下葬完成</h2>
              <span className="en">BURIED</span>
            </div>
            <Tombstone bug={buried} />
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <Link className="btn btn-primary" to="/cemetery">
                前往墓园探望
              </Link>
              <Link className="btn" to="/annual" style={{ marginLeft: 12 }}>
                查看殉职年报
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  )
}