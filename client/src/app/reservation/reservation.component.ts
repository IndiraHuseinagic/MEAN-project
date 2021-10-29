import { DateService } from './../date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApartmentService } from '../apartment.service';
import { UserService } from '../user.service';
import { ReservationService } from '../reservation.service';
import { take } from 'rxjs/operators';
import { Apartment } from '../models/apartment';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent  {
  apartment$: Observable<Apartment>;
  user$: Observable<any>;
  checkIn: Date;
  checkOut: Date;
  daysDiff: number = 1;

  constructor(
    private route: ActivatedRoute,
    private apartmentS: ApartmentService,
    private userS: UserService,
    private dateS: DateService,
    private reservationS: ReservationService,
    private router: Router) {

    const apartmentId = this.route.snapshot.paramMap.get('id') || "";
    this.apartment$ = this.apartmentS.getApartment(apartmentId);
    this.user$ = this.userS.getUser();

    this.checkIn = this.dateS.checkInValue;
    this.checkOut = this.dateS.checkOutValue;

    this.daysDiff = this.dateS.daysDiff(this.checkIn, this.checkOut);
   }
 
  finish(userId: string, apartmentId: string, checkIn: Date, checkOut: Date) {
    const reservation = { userId, apartmentId, checkIn, checkOut } //userId: userId...
     this.reservationS.addReservation(reservation).subscribe(
        (reservation)=>{
          alert('Thank You for Your Reservation')
          this.router.navigate(['/']);  
        },
        (error)=> {
          alert(error);
          this.router.navigate(['/apartments/'+ apartmentId]);
        });  
     }     

}
