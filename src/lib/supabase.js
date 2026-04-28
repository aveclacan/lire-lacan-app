import { createClient } from '@supabase/supabase-js'

// Estas variáveis serão preenchidas após criar o projeto no Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Autenticação ──────────────────────────────────────
export async function signUp(email, password, nome) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } }
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  // Limpar sessão anterior antes de tentar — evita conflito com sessões antigas
  try { await supabase.auth.signOut() } catch(e) {}
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Progresso de leitura ──────────────────────────────
export async function salvarProgresso(userId, seminarioNum, segIds) {
  const { error } = await supabase
    .from('progresso')
    .upsert({
      user_id: userId,
      seminario: seminarioNum,
      segs_lidos: segIds,
      atualizado_em: new Date().toISOString()
    }, { onConflict: 'user_id,seminario' })
  if (error) console.error('Erro ao salvar progresso:', error)
}

export async function carregarProgresso(userId, seminarioNum) {
  const { data } = await supabase
    .from('progresso')
    .select('segs_lidos')
    .eq('user_id', userId)
    .eq('seminario', seminarioNum)
    .single()
  return data?.segs_lidos || []
}

// ── Highlights ────────────────────────────────────────
export async function salvarHighlight(userId, highlight) {
  const { data, error } = await supabase
    .from('highlights')
    .insert({
      user_id: userId,
      seminario: highlight.seminario,
      seg_id: highlight.segId,
      texto: highlight.texto,
      cor: highlight.cor,
      criado_em: new Date().toISOString()
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function carregarHighlights(userId, seminarioNum) {
  const { data } = await supabase
    .from('highlights')
    .select('*')
    .eq('user_id', userId)
    .eq('seminario', seminarioNum)
    .order('criado_em', { ascending: true })
  return data || []
}

export async function deletarHighlight(id) {
  const { error } = await supabase
    .from('highlights')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Comentários ───────────────────────────────────────
export async function salvarComentario(userId, comentario) {
  const { data, error } = await supabase
    .from('comentarios')
    .insert({
      user_id: userId,
      seminario: comentario.seminario,
      seg_id: comentario.segId,
      texto_fr: comentario.textoFr,
      nota: comentario.nota,
      criado_em: new Date().toISOString()
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function carregarComentarios(userId, seminarioNum) {
  const { data } = await supabase
    .from('comentarios')
    .select('*')
    .eq('user_id', userId)
    .eq('seminario', seminarioNum)
    .order('criado_em', { ascending: true })
  return data || []
}

// ── Notas pessoais (caderno) ──────────────────────────
export async function salvarNota(userId, titulo, conteudo, notaId = null) {
  if (notaId) {
    const { data, error } = await supabase
      .from('notas')
      .update({ titulo, conteudo, atualizado_em: new Date().toISOString() })
      .eq('id', notaId)
      .eq('user_id', userId)
      .select().single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('notas')
      .insert({
        user_id: userId,
        titulo,
        conteudo,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      })
      .select().single()
    if (error) throw error
    return data
  }
}

export async function carregarNotas(userId) {
  const { data } = await supabase
    .from('notas')
    .select('*')
    .eq('user_id', userId)
    .order('atualizado_em', { ascending: false })
  return data || []
}

export async function deletarNota(userId, notaId) {
  const { error } = await supabase
    .from('notas')
    .delete()
    .eq('id', notaId)
    .eq('user_id', userId)
  if (error) throw error
}

// ── Trechos salvos ────────────────────────────────────
export async function salvarTrecho(userId, trecho) {
  const { data, error } = await supabase
    .from('trechos_salvos')
    .insert({
      user_id: userId,
      seminario: trecho.seminario,
      seg_id: trecho.segId,
      texto_fr: trecho.textoFr,
      traducao: trecho.traducao,
      criado_em: new Date().toISOString()
    })
    .select().single()
  if (error) throw error
  return data
}

export async function carregarTrechos(userId) {
  const { data } = await supabase
    .from('trechos_salvos')
    .select('*')
    .eq('user_id', userId)
    .order('criado_em', { ascending: false })
  return data || []
}
