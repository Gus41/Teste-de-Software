import { ApiManager } from './ApiManager.js';
import { Client } from '../modules/models/Client.js';
global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear(); 
});



