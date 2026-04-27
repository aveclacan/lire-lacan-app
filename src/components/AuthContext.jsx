import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) carregarPerfil(session.user.id)
      else setCarregando(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await carregarPerfil(session.user.id)
        } else {
          setPerfil(null)
          setCarregando(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function carregarPerfil(userId) {
    const { data } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', userId)
      .single()
    setPerfil(data)
    setCarregando(false)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
