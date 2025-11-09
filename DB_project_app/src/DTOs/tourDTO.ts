export class TourDTO {
    constructor(
        public id: number,
        public type: string,
        public description: string,
        public price: number
    ) {}
}