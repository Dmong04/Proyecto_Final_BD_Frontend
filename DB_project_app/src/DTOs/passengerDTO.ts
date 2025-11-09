import { TourDetailDTO } from "./tour_detailDTO";

export class PassengerDTO {
  constructor(
    public id: number,
    public name: string,
    public age: number,
    public tourDetail: TourDetailDTO
  ) { }
}   