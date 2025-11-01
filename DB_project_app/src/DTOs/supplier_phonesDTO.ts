import { SupplierDTO } from "./supplierDTO";

export class SupplierPhonesDTO {
    constructor(
        public id: number,
        public phone: string,
        public supplierDTO: SupplierDTO
    ) {}
}