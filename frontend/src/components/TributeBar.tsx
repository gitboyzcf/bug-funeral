import { useCallback, useState } from 'react'
import { payTribute } from '../api/client'
import type { BugRecord } from '../types'

interface Props {
  bug: BugRecord
}

type TributeKey = 'incense' | 'flower' | 'paper'
type TributeField = 'Incense' | 'Flowers' | 'Paper'

const TRIBUTE_META: { key: TributeKey; label: string; glyph: string; field: TributeField }[] = [
  { key: 'incense', label: '上香', glyph: '🕯️', field: 'Incense' },
  { key: 'flower', label: '献花', glyph: '🌸', field: 'Flowers' },
  { key: 'paper', label: '烧纸', glyph: '💸', field: 'Paper' },
]

export default function TributeBar({ bug }: Props) {
  const [tributes, setTributes] = useState(bug.Tributes)
  const [glyphs, setGlyphs] = useState<Record<string, number>>({})

  const handle = useCallback(
    async (type: TributeKey, field: TributeField) => {
      setGlyphs((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }))
      try {
        const updated = await payTribute(bug.Id, type)
        setTributes(updated.Tributes)
      } catch {
        setTributes((prev) => ({ ...prev, [field]: prev[field] + 1 }))
      }
    },
    [bug.Id],
  )

  return (
    <div className="tribute-bar">
      {TRIBUTE_META.map((meta) => (
        <button
          key={meta.key}
          className="tribute-btn"
          onClick={() => handle(meta.key, meta.field)}
        >
          {glyphs[meta.key] ? (
            <span key={glyphs[meta.key]} className="float-glyph">
              {meta.glyph}
            </span>
          ) : null}
          {meta.glyph} {meta.label}
          <span className="count">{tributes[meta.field]}</span>
        </button>
      ))}
    </div>
  )
}