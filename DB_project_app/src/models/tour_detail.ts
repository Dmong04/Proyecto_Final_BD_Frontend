
import { Tour } from './tour'
import { Supplier } from './supplier'
import type { Reservation } from './reservation'

export interface Passenger {
  id: number
  name: string
  age: number
  tour_detail_id: number
}


export class TourDetail {
  constructor(
    public id: number,
    public origin: string,
    public destination: string,
    public tour: Tour,
    public reservation: Reservation,
    public supplier: Supplier,
    public tour_id?: number,
    public reservation_id?: number,
    public supplier_id?: number,
    public passengers?: Passenger[]
  ) { }
}
