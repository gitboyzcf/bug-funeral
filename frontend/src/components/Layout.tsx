import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <nav>
        <div className="nav-in">
          <NavLink to="/" className="logo">
            <span className="logo-mark">⚰</span>
            BUG 殡仪馆
          </NavLink>
          <div className="nav-links">
            <NavLink to="/" end>
              接待处
            </NavLink>
            <NavLink to="/cemetery">墓园</NavLink>
            <NavLink to="/annual">殉职年报</NavLink>
          </div>
        </div>
      </nav>
      {children}
      <footer>
        <div className="slogan">让每个 Bug 死得体面</div>
        <div>Bug 殡仪馆 · KIRO 鬼点子计划参赛作品 · 全程使用 Kiro 开发</div>
      </footer>
    </>
  )
}