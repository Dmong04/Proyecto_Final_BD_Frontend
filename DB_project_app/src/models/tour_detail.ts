import { Tour } from './tour'
import { Supplier } from './supplier'
import type { Reservation } from './reservation'

export class TourDetail {
  constructor(
    public id: number,
    public origin: string,
    public destination: string,
    public tour: Tour,
    public reservation: Reservation,
    public supplier: Supplier
  ) { }
}
