import { TourDTO } from "./tourDTO";
import { SupplierDTO } from "./supplierDTO";
import { ReservationDTO } from "./reservationDTO";

export class TourDetailDTO {
    constructor(
        public id: number,
        public origin: string,
        public destination: string,
        public tourDTO: TourDTO,
        public reservationDTO: ReservationDTO,
        public supplierDTO: SupplierDTO
    ) {}
}