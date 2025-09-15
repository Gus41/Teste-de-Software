# Teste de Software
Trabalho de testes de software.

## Rodar API
1. Navegar para o backend:
    ```bash
    cd backend
    ```
2. Ativar o ambiente virtual:
    ```bash
    venv\Scripts\activate
    ```
3. Navegar para o projeto e rodar o servidor:
    ```bash
    cd project
    python manage.py runserver
    ```

## Rotas da API

### Clientes
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | /clientes/ | Lista todos os clientes |
| POST   | /clientes/ | Cria um novo cliente **com uma ContaCorrente associada automaticamente** |
| GET    | /clientes/id/ | Busca cliente por ID |
| PUT    | /clientes/id/ | Atualiza cliente (e conta, se enviado) |
| PATCH  | /clientes/id/ | Atualização parcial do cliente |
| DELETE | /clientes/id/ | Remove cliente e sua conta associada |

### Contas Correntes
| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | /contas/ | Lista todas as contas correntes |
| POST   | /contas/ | Cria uma nova conta corrente |
| GET    | /contas/id/ | Busca conta por ID |
| PUT    | /contas/id/ | Atualiza conta (saldo, status) |
| PATCH  | /contas/id/ | Atualização parcial da conta |
| DELETE | /contas/id/ | Remove a conta corrente |
