import { Client } from "./client";

export class ClientPhones {
    constructor(
        public id: number,
        public phone: string,
        public client: Client
    ) { }
}