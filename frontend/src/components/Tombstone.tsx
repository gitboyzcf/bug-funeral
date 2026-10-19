import type { BugRecord } from '../types'
import TributeBar from './TributeBar'

interface Props {
  bug: BugRecord

}

const BURIAL_NAMES: Record<string, string> = {
  earth: '土葬',
  fire: '火葬',
  sea: '海葬',
}

export default function Tombstone({ bug }: Props) {
  return (
    <div className="tomb">
      <div className="tomb-stone">
        <div className="rip">R.I.P.</div>
        <div className="err-type">{bug.ErrorType}</div>
        <div className="dates">
          {bug.Language} · 卒于 {bug.CreatedAt}
        </div>
        <div className="epitaph">{bug.Epitaph}</div>
      </div>
      <div className="tomb-base" />
      <TributeBar bug={bug} />
      <div className={`burial-tag burial-tag-${bug.BurialType}`} style={{ marginTop: 10 }}>
        {BURIAL_NAMES[bug.BurialType] || bug.BurialType} · 危害 {bug.Severity} ★
      </div>
    </div>
  )
}