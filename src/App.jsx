import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './components/AuthContext'
import AuthPage from './pages/AuthPage'

// Após login, redirecionar para o leitor no GitHub Pages
// com o token de sessão para identificar o usuário
function ReaderPage() {
  const { carregando } = useAuth()

  useEffect(() => {
    if (!carregando) {
      window.location.href = 'https://aveclacan.github.io/lire-lacan'
    }
  }, [carregando])

  return <div style={loadingStyle}>Redirecionando…</div>
}

const loadingStyle = {
  height: '100vh', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontFamily: "'IM Fell English', serif",
  fontSize: 16, color: 'var(--ink-faint)'
}

const userBarStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
  gap: 12, padding: '6px 16px',
  background: 'var(--paper-warm)', borderBottom: '1px solid var(--border)',
  fontFamily: "'Karla', sans-serif",
}

const sairBtnStyle = {
  background: 'none', border: '1px solid var(--border)',
  borderRadius: 6, padding: '3px 10px', fontSize: 11,
  color: 'var(--ink-faint)', cursor: 'pointer',
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/ler" element={<ReaderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
