-- ═══════════════════════════════════════════════════
--  LIRE LACAN — Schema do Supabase
--  Execute este SQL no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════

-- Perfis de usuário (extensão da tabela auth.users)
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT,
  email TEXT,
  plano TEXT DEFAULT 'gratuito' CHECK (plano IN ('gratuito', 'pago')),
  avatar_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Progresso de leitura por seminário
CREATE TABLE IF NOT EXISTS public.progresso (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seminario INTEGER NOT NULL,
  segs_lidos TEXT[] DEFAULT '{}',
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, seminario)
);

-- Highlights (destaques coloridos)
CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seminario INTEGER NOT NULL,
  seg_id TEXT NOT NULL,
  texto TEXT NOT NULL,
  cor TEXT DEFAULT 'yellow' CHECK (cor IN ('yellow', 'green', 'blue')),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários nos segmentos
CREATE TABLE IF NOT EXISTS public.comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seminario INTEGER NOT NULL,
  seg_id TEXT NOT NULL,
  texto_fr TEXT NOT NULL,
  nota TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Notas pessoais (caderno)
CREATE TABLE IF NOT EXISTS public.notas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT DEFAULT 'Sem título',
  conteudo TEXT DEFAULT '',
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Trechos salvos
CREATE TABLE IF NOT EXISTS public.trechos_salvos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seminario INTEGER NOT NULL,
  seg_id TEXT NOT NULL,
  texto_fr TEXT NOT NULL,
  traducao TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security (RLS) ──────────────────────────
-- Cada usuário só acessa seus próprios dados

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trechos_salvos ENABLE ROW LEVEL SECURITY;

-- Políticas: usuário só vê e edita seus próprios dados
CREATE POLICY "Perfil próprio" ON public.perfis
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Progresso próprio" ON public.progresso
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Highlights próprios" ON public.highlights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comentários próprios" ON public.comentarios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Notas próprias" ON public.notas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Trechos próprios" ON public.trechos_salvos
  FOR ALL USING (auth.uid() = user_id);

-- ── Trigger: criar perfil automaticamente ao cadastrar ──
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER ao_criar_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_novo_usuario();
