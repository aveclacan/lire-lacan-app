import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase'

export default function AuthPage() {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const LEITOR_URL = 'https://aveclacan.github.io/lire-lacan'

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(''); setMsg(''); setLoading(true)

    // Timeout de 10s — evita "Aguarde..." infinito se Supabase não responder
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setErro('A conexão demorou muito. Verifique sua internet e tente novamente.')
    }, 10000)

    try {
      if (modo === 'login') {
        await signIn(email, senha)
        clearTimeout(timeoutId)
        window.location.href = LEITOR_URL
      } else {
        await signUp(email, senha, nome)
        clearTimeout(timeoutId)
        setMsg('Cadastro realizado! Você já pode entrar.')
        setModo('login')
        setLoading(false)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      const msgs = {
        'Invalid login credentials': 'Email ou senha incorretos.',
        'User already registered': 'Este email já está cadastrado.',
        'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
        'Unable to validate email address: invalid format': 'Email inválido.',
        'Email not confirmed': 'Email não confirmado. Entre em contato com o suporte.',
      }
      setErro(msgs[err.message] || err.message)
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoLire}>LIRE</span>
          <span style={styles.logoLacan}> LACAN</span>
        </div>
        <p style={styles.tagline}>
          Leitor bilíngue dos Seminários de Jacques Lacan
        </p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(modo === 'login' ? styles.tabActive : {}) }}
            onClick={() => { setModo('login'); setErro(''); setMsg('') }}
          >
            Entrar
          </button>
          <button
            style={{ ...styles.tab, ...(modo === 'cadastro' ? styles.tabActive : {}) }}
            onClick={() => { setModo('cadastro'); setErro(''); setMsg('') }}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {modo === 'cadastro' && (
            <div style={styles.field}>
              <label style={styles.label}>Nome</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : '••••••••'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <div style={styles.erro}>{erro}</div>}
          {msg && <div style={styles.msgOk}>{msg}</div>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Aguarde…' : modo === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {/* Acesso sem cadastro */}
        <div style={styles.semLogin}>
          <button style={styles.linkBtn} onClick={() => { window.location.href = LEITOR_URL }}>
            Continuar sem conta →
          </button>
          <p style={styles.semLoginNote}>
            Sem conta, o progresso e os destaques não são salvos.
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--paper)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Karla', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--paper-warm)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px 36px',
    boxShadow: '0 8px 32px rgba(26,23,18,0.08)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '0.12em',
    fontSize: '22px',
    fontFamily: "'IM Fell English SC', serif",
  },
  logoLire: { color: 'var(--ink)' },
  logoLacan: { color: 'var(--accent)' },
  tagline: {
    textAlign: 'center',
    fontSize: '12.5px',
    color: 'var(--ink-faint)',
    fontStyle: 'italic',
    fontFamily: "'IM Fell English', serif",
    marginBottom: '32px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '28px',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--ink-faint)',
    cursor: 'pointer',
    fontSize: '13.5px',
    fontFamily: "'Karla', sans-serif",
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition: 'all .15s',
  },
  tabActive: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11.5px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink-faint)',
  },
  input: {
    padding: '10px 12px',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontSize: '14.5px',
    fontFamily: "'Karla', sans-serif",
    outline: 'none',
    transition: 'border-color .15s',
  },
  btn: {
    marginTop: '8px',
    padding: '12px',
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: "'Karla', sans-serif",
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background .15s',
  },
  erro: {
    background: 'rgba(200,50,50,0.08)',
    border: '1px solid rgba(200,50,50,0.2)',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#c03030',
  },
  msgOk: {
    background: 'rgba(50,150,80,0.08)',
    border: '1px solid rgba(50,150,80,0.2)',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#2a7a40',
  },
  semLogin: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-light)',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Karla', sans-serif",
    textDecoration: 'underline',
  },
  semLoginNote: {
    fontSize: '11px',
    color: 'var(--ink-faint)',
    marginTop: '6px',
  },
}
