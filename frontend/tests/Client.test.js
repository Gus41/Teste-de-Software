import { Client } from "../modules/models/Client.js";

describe("Client model", () => {
  test("should create a client with name, age, email and active status", () => {
    const client = new Client(1,"João", 30, "joao@email.com", true);
    expect(client.id).toBe(1);
    expect(client.nome).toBe("João");
    expect(client.idade).toBe(30);
    expect(client.email).toBe("joao@email.com");
    expect(client.ativo).toBe(true);
  });
});
