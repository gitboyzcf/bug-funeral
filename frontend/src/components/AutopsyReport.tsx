import type { AutopsyReport } from '../types'

interface Props {
  report: AutopsyReport
}

function SeverityStars({ level }: { level: number }) {
  return <span className={`stars sev-${level}`}>{'★'.repeat(level)}{'☆'.repeat(5 - level)}</span>
}

export default function AutopsyReportView({ report }: Props) {
  return (
    <div className="report">
      <div className="report-head">
        <h3>☠ 验尸报告</h3>
        <span className="tag">档案编号 {report.CaseNumber}</span>
        <span className="case-no">BUG 殡仪馆法医科 出具</span>
      </div>
      <div className="report-body">
        <div className="report-cell">
          <div className="report-label">逝者姓名 / ERROR TYPE</div>
          <div className="report-value big">{report.ErrorType}</div>
        </div>
        <div className="report-cell">
          <div className="report-label">语种 / LANGUAGE</div>
          <div className="report-value big">{report.Language}</div>
        </div>
        <div className="report-cell">
          <div className="report-label">案发现场 / LOCATION</div>
          <div className="report-value">{report.Location}</div>
        </div>
        <div className="report-cell">
          <div className="report-label">危害等级 / SEVERITY</div>
          <div className="report-value">
            <SeverityStars level={report.Severity} />
          </div>
        </div>
        <div className="report-cell full">
          <div className="report-label">生前生平 / BIOGRAPHY</div>
          <div className="report-value">{report.Biography}</div>
        </div>
        <div className="report-cell full">
          <div className="report-label">死因鉴定 / CAUSE OF DEATH</div>
          <div className="report-value">{report.CauseOfDeath}</div>
        </div>
        <div className="report-cell full">
          <div className="report-label">临终遗言 / LAST MESSAGE</div>
          <div className="report-value">{report.ErrorMessage}</div>
        </div>
      </div>
    </div>
  )
}