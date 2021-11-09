export interface Apartment{
    _id: string;
    title: string;
    category: {name: string, _id: string},
    imageUrl: String;
    address: string;
    guests: number,
    area: number,
    unavailable: {checkIn: Date, checkOut: Date}[],
    dailyPrice: number
}
