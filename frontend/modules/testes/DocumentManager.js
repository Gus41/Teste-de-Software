import { DocumentManager } from '../path/to/DocumentManager';
import { Client } from '../modules/models/Client.js';
import { Account } from '../modules/models/Account.js';

jest.mock('../path/to/ApiManager.js', () => {
    return {
        ApiManager: jest.fn().mockImplementation(() => ({
            getClients: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    nome: 'Fulano',
                    idade: 30,
                    email: 'fulano@email.com',
                    ativo: true,
                    conta_corrente: {
                        saldo: 1000,
                        ativa: true
                    }
                }
            ]),
            createClient: jest.fn(),
            updateClient: jest.fn(),
            deleteClient: jest.fn()
        }))
    };
});

describe('DocumentManager', () => {
    let container, form, editForm, modal, cancelBtn, deleteBtn;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="client-form">
                <input name="nome" value="João" />
                <input name="idade" value="25" />
                <input name="email" value="joao@email.com" />
                <input name="saldo" value="100" />
                <input name="ativo" type="checkbox" checked />
                <input name="ativa" type="checkbox" checked />
            </form>

            <div id="clients-container"></div>

            <div id="editModal" class="hidden"></div>
            <form id="edit-form">
                <input name="id" value="1" />
                <input name="nome" />
                <input name="idade" />
                <input name="email" />
                <input name="ativo" type="checkbox" />
                <input name="saldo" />
                <input name="ativa" type="checkbox" />
            </form>

            <button id="cancelBtn">Cancelar</button>
            <button id="deleteBtn">Deletar</button>
        `;

        container = document.getElementById('clients-container');
        form = document.getElementById('client-form');
        editForm = document.getElementById('edit-form');
        modal = document.getElementById('editModal');
        cancelBtn = document.getElementById('cancelBtn');
        deleteBtn = document.getElementById('deleteBtn');
    });

    it('valida o formulário corretamente', () => {
        const manager = new DocumentManager('client-form', 'clients-container');
        expect(manager.validateForm()).toBe(true);
    });

    it('executa handlePost e chama post corretamente', () => {
        const manager = new DocumentManager('client-form', 'clients-container');
        const postSpy = jest.spyOn(manager, 'post');
        manager.handlePost();
        expect(postSpy).toHaveBeenCalled();
    });

    it('carrega os clientes e renderiza corretamente', async () => {
        const manager = new DocumentManager('client-form', 'clients-container');
        await manager.loadClients();
        expect(container.innerHTML).toContain('Fulano');
    });

    it('abre o modal e preenche os campos com openModal()', () => {
        const manager = new DocumentManager('client-form', 'clients-container');
        const cliente = {
            id: 2,
            nome: 'Maria',
            idade: 40,
            email: 'maria@email.com',
            ativo: true,
            conta_corrente: {
                saldo: 500,
                ativa: true
            }
        };
        manager.openModal(cliente);
        expect(editForm.nome.value).toBe('Maria');
        expect(modal.classList.contains('hidden')).toBe(false);
    });

    it('executa handleEditSubmit corretamente', async () => {
        const manager = new DocumentManager('client-form', 'clients-container');
        const updateSpy = jest.spyOn(manager.apiManager, 'updateClient');

        const cliente = {
            id: 3,
            nome: 'Carlos',
            idade: 50,
            email: 'carlos@email.com',
            ativo: true,
            conta_corrente: {
                saldo: 1000,
                ativa: true
            }
        };

        manager.openModal(cliente);

        editForm.nome.value = 'Carlos Silva';
        editForm.idade.value = '51';
        editForm.email.value = 'carlos.silva@email.com';
        editForm.ativo.checked = false;
        editForm.saldo.value = '2000';
        editForm.ativa.checked = false;

        const event = new Event('submit');
        event.preventDefault = jest.fn();

        manager.handleEditSubmit(event);

        expect(updateSpy).toHaveBeenCalledWith(
            '3',
            expect.any(Client)
        );
    });
});
