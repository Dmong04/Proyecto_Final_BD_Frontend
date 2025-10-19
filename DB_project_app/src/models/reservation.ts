import { User } from './user'

export class Reservation {
  constructor(
    public id: number,
    public date: Date,
    public time: string,
    public description: string,
    public tour_subtotal: number,
    public extra_subtotal: number,
    public total: number,
    public user: User
  ) { }
}
