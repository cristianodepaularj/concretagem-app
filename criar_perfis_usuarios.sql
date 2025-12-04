-- Execute este SQL no Supabase SQL Editor para criar os perfis dos usuários existentes

-- Inserir perfil para cristianospaula1972@gmail.com (Admin)
INSERT INTO public.users (id, email, name, role, branch, phone)
VALUES (
    '8b5c2217-df59-4d4f-9a6e-d766ee0288d8',
    'cristianospaula1972@gmail.com',
    'Cristiano Santos de Paula',
    'admin',
    NULL,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Inserir perfil para csp1972@gmail.com (Consultor)
INSERT INTO public.users (id, email, name, role, branch, phone)
VALUES (
    '4d63e2be-a4d0-4269-990a-15eea1357686',
    'csp1972@gmail.com',
    'csp1972',
    'consultant',
    'PIRACICABA',
    '21972866430'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    branch = EXCLUDED.branch,
    phone = EXCLUDED.phone;

-- Inserir perfil para cursos.csp1972@gmail.com (Consultor)
INSERT INTO public.users (id, email, name, role, branch, phone)
VALUES (
    '859c9c93-4865-42eb-9699-d6631d53568d',
    'cursos.csp1972@gmail.com',
    'Cristiano Santos de Paula',
    'consultant',
    'PIRACICABA',
    '21972866430'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    branch = EXCLUDED.branch,
    phone = EXCLUDED.phone;

-- Verificar se os perfis foram criados
SELECT * FROM public.users;
