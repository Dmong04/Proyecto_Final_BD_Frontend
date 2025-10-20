import { ExtraDTO } from "./extraDTO";

export class ExtraDetailDTO {
    constructor(
        public id: number,
        public person_count: number,
        public total_price: number,
        public extraDTO: ExtraDTO
    ) {}
}