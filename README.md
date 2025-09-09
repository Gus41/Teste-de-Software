# Teste de Software
 Trabalho de testes de software

# Rodar api
 - cd backend
 - venv\Scripts\activate
 - cd project
 - python manage.py runserver

## rotas
    GET /clientes/ → Lista todos os clientes
    POST /clientes/ → Cria novo cliente + conta corrente associada
    GET /clientes/<id>/ → Busca cliente por ID
    PUT /clientes/<id>/ → Atualiza cliente (e conta, se enviado)
    PATCH /clientes/<id>/ → Atualização parcial
    DELETE /clientes/<id>/ → Remove cliente e sua conta