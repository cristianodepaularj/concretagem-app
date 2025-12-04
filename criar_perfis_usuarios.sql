-- Execute este SQL no Supabase SQL Editor
-- Este script cria perfis para os usuários que já existem no auth.users

-- Primeiro, vamos ver quais usuários existem no auth.users
-- SELECT id, email FROM auth.users;

-- Criar perfis para TODOS os usuários que existem no auth.users mas não têm perfil
INSERT INTO public.users (id, email, name, role, branch, phone)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as name,
    CASE 
        WHEN au.email = 'cristianospaula1972@gmail.com' THEN 'admin'
        ELSE 'consultant'
    END as role,
    'PIRACICABA' as branch,
    NULL as phone
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Atualizar dados do admin se já existir
UPDATE public.users
SET 
    name = 'Cristiano Santos de Paula',
    role = 'admin'
WHERE email = 'cristianospaula1972@gmail.com';

-- Atualizar dados do consultor csp1972 se já existir
UPDATE public.users
SET 
    name = 'csp1972',
    role = 'consultant',
    branch = 'PIRACICABA',
    phone = '21972866430'
WHERE email = 'csp1972@gmail.com';

-- Atualizar dados do consultor cursos.csp1972 se já existir
UPDATE public.users
SET 
    name = 'Cristiano Santos de Paula',
    role = 'consultant',
    branch = 'PIRACICABA',
    phone = '21972866430'
WHERE email = 'cursos.csp1972@gmail.com';

-- Verificar os perfis criados
SELECT id, email, name, role, branch FROM public.users ORDER BY email;
