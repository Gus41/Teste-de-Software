import { Client } from '../modules/models/Client.js';

export class ApiManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async getClients() {
        const res = await fetch(`${this.apiUrl}/clientes`);
        const data = await res.json();
        return data.map(c => new Client(
            c.nome,
            c.idade,
            c.email,
            c.ativo,
            c.conta_corrente
        ));
    }

    async getClientById(id) {
        const res = await fetch(`${this.apiUrl}/clientes/${id}`);
        const c = await res.json();
        return new Client(
            c.nome,
            c.idade,
            c.email,
            c.ativo,
            c.conta_corrente
        );
    }

    async createClient(client) {
        console.log(client.conta_corrente)
        const res = await fetch(`${this.apiUrl}/clientes/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: client.nome,
                idade: client.idade,
                email: client.email,
                ativo: client.ativo,
                conta_corrente: client.conta_corrente
            })
        });
        return await res.json();
    }

    async updateClient(id, client) {
        const res = await fetch(`${this.apiUrl}/clientes/${id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: client.nome,
                idade: client.idade,
                email: client.email,
                ativo: client.ativo,
                conta_corrente: client.conta_corrente
            })
        });
        return await res.json();
    }

    async deleteClient(id) {
        const res = await fetch(`${this.apiUrl}/clientes/${id}/`, {
            method: "DELETE"
        });
        return res.ok;
    }
}

