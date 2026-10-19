import type { BurialOption, BurialType } from '../types'

const BURIAL_OPTIONS: BurialOption[] = [
  { key: 'earth', name: '土葬', desc: '注释里封印，永世不得编译', icon: '🪦' },
  { key: 'fire', name: '火葬', desc: '一把火烧掉 diff，防止转世', icon: '🔥' },
  { key: 'sea', name: '海葬', desc: 'push 到远端，永不回收', icon: '🌊' },
]

interface Props {
  recommended: string
  note: string
  disabled: boolean
  onChoose: (type: BurialType) => void
}

export default function BurialPicker({ recommended, note, disabled, onChoose }: Props) {
  return (
    <div>
      <div className="s-head">
        <h2>选择葬礼规格</h2>
        <span className="en">BURIAL</span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
        法医推荐：<b style={{ color: 'var(--purple-d)' }}>{BURIAL_OPTIONS.find((o) => o.key === recommended)?.name}</b>
        ，{note}
      </p>
      <div className="burial-grid">
        {BURIAL_OPTIONS.map((option) => (
          <div key={option.key} className={`burial-option${option.key === recommended ? ' recommended' : ''}`}>
            {option.key === recommended && <div className="rec-badge">法医推荐</div>}
            <span className="icon">{option.icon}</span>
            <h4>{option.name}</h4>
            <p>{option.desc}</p>
            <button className="btn btn-primary" disabled={disabled} onClick={() => onChoose(option.key)}>
              选择{option.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}