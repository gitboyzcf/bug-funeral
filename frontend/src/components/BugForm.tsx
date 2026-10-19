import { useState } from 'react'

const SAMPLE_STACK = `Traceback (most recent call last):
  File "payment_service.py", line 87, in charge_order
    result = gateway.refund(order_id)
  File "gateway/client.py", line 142, in refund
    conn = pool.acquire(timeout=3)
  File "pool.py", line 56, in acquire
    return self._connections[None]
IndexError: list index out of range`

interface Props {
  onSubmit: (stack: string) => void
  loading: boolean
}

export default function BugForm({ onSubmit, loading }: Props) {
  const [stack, setStack] = useState('')

  return (
    <div className="card">
      <div className="s-head">
        <h2>接待窗口</h2>
        <span className="en">RECEPTION</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>
        请把逝者（报错堆栈）抬进来。粘贴后，AI 验尸官将为它出具验尸报告。
      </p>
      <textarea
        className="stack-input"
        placeholder="在这里粘贴报错堆栈 / 异常信息 / commit message ..."
        value={stack}
        onChange={(e) => setStack(e.target.value)}
      />
      <div className="form-actions">
        <button
          className="btn btn-primary"
          disabled={loading || !stack.trim()}
          onClick={() => onSubmit(stack)}
        >
          {loading ? '验尸中' : '送入验尸房'}
        </button>
        <button className="btn" disabled={loading} onClick={() => setStack(SAMPLE_STACK)}>
          试试示例逝者
        </button>
        <span className="form-hint">支持 Python / Java / JS / Go / C++ 等各语种逝者</span>
      </div>
    </div>
  )
}