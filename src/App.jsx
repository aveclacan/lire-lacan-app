import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthContext'
import AuthPage from './pages/AuthPage'

// O leitor é o index.html atual adaptado como componente
// Por ora, redireciona para a versão GitHub Pages enquanto migramos
function ReaderPage() {
  const { user, perfil, carregando } = useAuth()
  if (carregando) return <div style={loadingStyle}>Carregando…</div>
  // O leitor completo será migrado aqui na próxima etapa
  // Por ora usa o mesmo HTML via iframe para manter funcionamento
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user && (
        <div style={userBarStyle}>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            {perfil?.nome || user.email}
          </span>
          <button
            style={sairBtnStyle}
            onClick={async () => {
              const { supabase } = await import('./lib/supabase')
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
          >
            Sair
          </button>
        </div>
      )}
      <iframe
        src="/leitor/index.html"
        style={{ flex: 1, border: 'none', width: '100%' }}
        title="Lire Lacan"
      />
    </div>
  )
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
