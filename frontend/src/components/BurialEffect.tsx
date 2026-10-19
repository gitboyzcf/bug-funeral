import { useEffect, useMemo } from 'react'
import type { BurialType } from '../types'

interface Props {
  type: BurialType
  errorType: string
  onDone: () => void
}

const EFFECT_TEXT: Record<BurialType, string> = {
  earth: '土葬进行中，注释封印完毕',
  fire: '火葬进行中，diff 焚烧殆尽',
  sea: '海葬进行中，永不重连',
}

const DURATION = 2600

export default function BurialEffect({ type, errorType, onDone }: Props) {
  useEffect(() => {
    const doneTimer = setTimeout(onDone, DURATION)
    return () => {
      clearTimeout(doneTimer)
    }
  }, [onDone])

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: 30 + Math.random() * 60,
        dx: `${(Math.random() - 0.5) * 140}px`,
        dy: `${-20 - Math.random() * 60}px`,
        delay: `${Math.random() * 1.2}s`,
        key: i,
      })),
    [],
  )

  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: 20 + Math.random() * 70,
        dx: `${(Math.random() - 0.5) * 40}px`,
        delay: `${Math.random() * 1.4}s`,
        key: i,
      })),
    [],
  )

  return (
    <div className={`effect-overlay ${type}`}>
      <div className="effect-stage">
        {type === 'earth' && (
          <>
            <div className="bury-stone">
              <div className="tomb-stone" style={{ width: 150, padding: '16px 12px' }}>
                <div className="rip" style={{ fontSize: 16 }}>R.I.P.</div>
                <div className="err-type" style={{ fontSize: 11 }}>{errorType}</div>
              </div>
            </div>
            <div className="dirt-pile">
              <i className="d1" />
              <i className="d2" />
              <i className="d3" />
            </div>
            {particles.map((p) => (
              <span
                key={p.key}
                className="dust"
                style={{ left: `${p.left}%`, bottom: 50, ['--dx' as string]: p.dx, ['--dy' as string]: p.dy, animationDelay: p.delay }}
              />
            ))}
          </>
        )}
        {type === 'fire' && (
          <>
            <div className="pixel-flame">
              <i className="f1" />
              <i className="f2" />
              <i className="f3" />
              <i className="f4" />
              <i className="f5" />
              <i className="f6" />
              <i className="f7" />
              <i className="f8" />
            </div>
            {particles.map((p) => (
              <span
                key={p.key}
                className="ember"
                style={{ left: `${p.left}%`, bottom: 90, ['--dx' as string]: p.dx, animationDelay: p.delay }}
              />
            ))}
            <div className="burn-paper">{errorType}.diff</div>
          </>
        )}
        {type === 'sea' && (
          <>
            <div className="sink-stone">
              <div className="tomb-stone" style={{ width: 150, padding: '16px 12px' }}>
                <div className="rip" style={{ fontSize: 16 }}>R.I.P.</div>
                <div className="err-type" style={{ fontSize: 11 }}>{errorType}</div>
              </div>
            </div>
            <div className="sea-wave" />
            {bubbles.map((b) => (
              <span
                key={b.key}
                className="bubble"
                style={{ left: `${b.left}%`, bottom: 100, ['--dx' as string]: b.dx, animationDelay: b.delay }}
              />
            ))}
          </>
        )}
      </div>
      <div className="effect-text">{EFFECT_TEXT[type]}</div>
    </div>
  )
}