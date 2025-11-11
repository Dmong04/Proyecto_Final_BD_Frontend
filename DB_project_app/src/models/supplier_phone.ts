import { Supplier } from './supplier'

export class PhoneSupplier {
    constructor(
        public id: number,
        public phone: string,
        public supplier: Supplier
    ) { }
}

export class SupplierPhone {
  constructor(
    public id: number,
    public phone: string,
    public supplier: any // Cambiado de Supplier a any para evitar dependencia circular
  ) {}
}