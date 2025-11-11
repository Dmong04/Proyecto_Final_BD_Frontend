import type { SupplierPhone } from './supplier_phone'

export class Supplier {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public email: string,
    public address: string,
    public phones: SupplierPhone[]
  ) {}
}