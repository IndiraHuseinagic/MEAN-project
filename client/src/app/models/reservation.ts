export interface Reservation{
    _id: string;
    user: {
        _id: string,
        name: string,
        email: string,
        phone: string
    },
    apartment: {
        _id: string, 
        title: string,
        imageUrl: string,
        address: string,
        dailyPrice: number
    }
    checkIn: Date,
    checkOut: Date,
    rentalFee: number
}