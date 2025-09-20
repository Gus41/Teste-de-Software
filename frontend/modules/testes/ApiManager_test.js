import { ApiManager } from './ApiManager.js';
import { Client } from '../modules/models/Client.js';
global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear(); 
});

test('getClients deve retornar uma lista de instâncias de Client', async () => {
    // Dados fake simulando retorno do backend
    const fakeClients = [
        {
            id: 1,
            nome: "João",
            idade: 30,
            email: "joao@example.com",
            ativo: true,
            conta_corrente: "12345-6"
        }
    ];

    
    fetch.mockResolvedValueOnce({
        json: async () => fakeClients
    });

    const api = new ApiManager('http://fakeapi.com');
    const clients = await api.getClients();

    expect(fetch).toHaveBeenCalledWith('http://fakeapi.com/clientes');

    expect(clients[0]).toBeInstanceOf(Client);
    expect(clients[0].nome).toBe("João");
});

