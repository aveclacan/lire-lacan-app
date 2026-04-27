# Lire Lacan — Guia de Migração
## GitHub Pages → Vercel + Supabase

---

## ETAPA 1 — Criar conta no Supabase (5 min)

1. Acesse https://supabase.com e clique em **Start your project**
2. Entre com sua conta Google
3. Clique em **New project**
4. Preencha:
   - **Name:** lire-lacan
   - **Database Password:** crie uma senha forte e guarde
   - **Region:** South America (São Paulo)
5. Clique em **Create new project** — aguarde ~2 minutos

### Configurar o banco de dados
6. No menu lateral, clique em **SQL Editor**
7. Clique em **New query**
8. Abra o arquivo `supabase_schema.sql` deste projeto
9. Cole todo o conteúdo no editor e clique em **Run**
10. Deve aparecer "Success" para cada comando

### Obter as credenciais
11. No menu lateral, clique em **Settings → API**
12. Copie o **Project URL** (parece: https://abcdefgh.supabase.co)
13. Copie o **anon public** key (chave longa começando com eyJ...)
14. Guarde os dois — você vai precisar no Passo 3

### Configurar autenticação por email
15. No menu lateral, clique em **Authentication → Providers**
16. Confirme que **Email** está habilitado
17. Em **Authentication → Settings**, desative "Confirm email" 
    se quiser que usuários entrem sem confirmar email (recomendado para testes)

---

## ETAPA 2 — Criar conta no Vercel (3 min)

1. Acesse https://vercel.com e clique em **Sign Up**
2. Escolha **Continue with GitHub** — use a mesma conta do repositório aveclacan
3. Clique em **Import Project**
4. Você verá seus repositórios — não importe ainda, primeiro precisamos subir o novo código

---

## ETAPA 3 — Criar o novo repositório no GitHub (5 min)

1. Acesse https://github.com/aveclacan
2. Clique em **New repository**
3. Nome: **lire-lacan-app** (diferente do repositório atual)
4. Deixe **Public** (necessário para Vercel gratuito)
5. Clique em **Create repository**

6. No seu Mac, abra o **Terminal** (em Aplicações → Utilitários)
7. Navegue até a pasta dos arquivos baixados:
   ```
   cd ~/Downloads/lire-lacan-app
   ```
8. Execute:
   ```
   git init
   git add .
   git commit -m "Migração inicial Lire Lacan"
   git branch -M main
   git remote add origin https://github.com/aveclacan/lire-lacan-app.git
   git push -u origin main
   ```

---

## ETAPA 4 — Configurar variáveis de ambiente (2 min)

1. Crie um arquivo `.env.local` na pasta do projeto com:
   ```
   VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
   ```
   (substitua pelos valores copiados na Etapa 1)

2. Este arquivo NÃO vai para o GitHub (está no .gitignore) — é local e seguro

---

## ETAPA 5 — Deploy no Vercel (5 min)

1. Volte ao Vercel (https://vercel.com/dashboard)
2. Clique em **Add New → Project**
3. Importe o repositório **lire-lacan-app**
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = seu Project URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua anon key do Supabase
5. Clique em **Deploy**
6. Aguarde ~2 minutos — o Vercel vai construir e publicar automaticamente

7. Você receberá uma URL como: **lire-lacan-app.vercel.app**
   - Esta será a nova URL do site
   - Cada novo commit no GitHub atualiza automaticamente — sem mais upload manual!

---

## ETAPA 6 — Mover o leitor atual para o novo projeto

1. Na pasta `lire-lacan-app/public/`, crie uma pasta `leitor/`
2. Copie o `index.html` atual do repositório `lire-lacan` para lá
3. Copie a pasta `seminarios/` para dentro de `public/leitor/`
4. Faça commit e push — o Vercel atualiza automaticamente

---

## O que funciona após a migração

- ✅ Login e cadastro de usuários por email/senha
- ✅ Cada usuário tem seu próprio espaço
- ✅ Progresso de leitura salvo na nuvem
- ✅ Highlights salvos por usuário
- ✅ Comentários salvos por usuário
- ✅ Trechos salvos por usuário
- ✅ Usuários sem conta podem ler sem salvar
- ✅ Deploy automático a cada atualização

## Próximas etapas (após validação)
- Migrar o leitor HTML para React completo
- Caderno de notas pessoais
- Stripe para assinaturas
- Google AdSense para monetização gratuita

---

## Suporte

Se tiver dúvida em qualquer etapa, me envie uma captura de tela
e continuamos daqui.
