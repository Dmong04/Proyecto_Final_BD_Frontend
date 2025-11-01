import { UserDTO } from "./userDTO";

export class ReservationDTO {
    constructor(
        public id: number,
        public date: Date,
        public time: string,
        public description: string,
        public tour_subtotal: number,
        public extra_subtotal: number,
        public total: number,
        public userDTO: UserDTO
    ) { }
}