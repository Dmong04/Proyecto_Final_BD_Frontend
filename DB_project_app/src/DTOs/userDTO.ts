import { AdminDTO } from "./adminDTO";
import { ClientDTO } from "./clientDTO";

export class UserDTO {
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public password: string,
        public clientDTO: ClientDTO,
        public adminDTO: AdminDTO,
    ) {}
}