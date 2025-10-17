import { Supplier } from './supplier'

export class PhoneSupplier {
    constructor(
        public id: number,
        public phone: string,
        public supplier: Supplier
    ) { }
}