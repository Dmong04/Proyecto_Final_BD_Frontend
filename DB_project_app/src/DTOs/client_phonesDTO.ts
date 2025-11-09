import { ClientDTO } from "./clientDTO";

export class ClientPhonesDTO {
    constructor(
        public id: number,
        public phone: string,
        public clientDTO: ClientDTO
    ) { }
}