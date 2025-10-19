import { Extra } from './extra'
import type { Reservation } from './reservation';

export class ExtraDetail {
  constructor(
    public id: number,
    public person_count: number,
    public total_price: number,
    public extra: Extra,
    public Reservation: Reservation
  ) { }
}
