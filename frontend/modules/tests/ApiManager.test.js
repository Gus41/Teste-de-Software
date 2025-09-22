import { ApiManager } from '../ApiManager.js';
import { Client } from '../models/Client.js';
import { jest } from '@jest/globals';


beforeEach(() => {
  global.fetch = jest.fn();
  fetch.mockClear();
});

describe('ApiManager', () => {
  const apiUrl = 'http://fakeapi.com';
  let apiManager;

  beforeEach(() => {
    apiManager = new ApiManager(apiUrl);
  });


  test('getClients retorna lista de Client', async () => {
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

    const clients = await apiManager.getClients();

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/clientes`);
    expect(clients[0]).toBeInstanceOf(Client);
    expect(clients[0].nome).toBe('João');
  });

  test('getClientById retorna um Client', async () => {
    const fakeClient = {
      id: 2,
      nome: "Maria",
      idade: 25,
      email: "maria@example.com",
      ativo: false,
      conta_corrente: "98765-4"
    };

    fetch.mockResolvedValueOnce({
      json: async () => fakeClient
    });

    const client = await apiManager.getClientById(2);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/clientes/2`);
    expect(client).toBeInstanceOf(Client);
    expect(client.nome).toBe('Maria');
  });

  test('createClient faz POST e retorna resposta', async () => {
    const newClient = {
      nome: "Pedro",
      idade: 40,
      email: "pedro@example.com",
      ativo: true,
      conta_corrente: "55555-1"
    };

    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 3, ...newClient })
    });

    const response = await apiManager.createClient(newClient);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/clientes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient)
    });

    expect(response.id).toBe(3);
    expect(response.nome).toBe("Pedro");
  });

  test('updateClient faz PUT e retorna resposta', async () => {
    const updatedClient = {
      nome: "Ana",
      idade: 35,
      email: "ana@example.com",
      ativo: false,
      conta_corrente: "33333-9"
    };

    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 4, ...updatedClient })
    });

    const response = await apiManager.updateClient(4, updatedClient);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/clientes/4/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedClient)
    });

    expect(response.id).toBe(4);
    expect(response.nome).toBe("Ana");
  });

  test('deleteClient faz DELETE e retorna true se sucesso', async () => {
    fetch.mockResolvedValueOnce({
      ok: true
    });

    const response = await apiManager.deleteClient(5);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/clientes/5/`, {
      method: "DELETE"
    });

    expect(response).toBe(true);
  });

  test('deleteClient retorna false se falha', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    const response = await apiManager.deleteClient(6);

    expect(response).toBe(false);
  });
});

