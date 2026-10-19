interface Props {
  num: number | string
  label: string
}

export default function StatCard({ num, label }: Props) {
  return (
    <div className="stat-card">
      <div className="num">{num}</div>
      <div className="label">{label}</div>
    </div>
  )
}