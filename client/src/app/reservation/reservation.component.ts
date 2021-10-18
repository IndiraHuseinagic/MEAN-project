import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Observable  } from 'rxjs';
import { ApartmentService } from '../apartment.service';
import { UserService } from '../user.service';
import { SharedService } from '../shared.service';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent  {
  apartment$: Observable<any>;
  user$: Observable<any>;
  range: any; 
  numberOfDays: number = 1;
  validationMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apartmentS: ApartmentService,
    private router: Router,
    private userS: UserService,
    private sharedS: SharedService,
    private reservationS: ReservationService) {

    const apartmentId = this.route.snapshot.paramMap.get('id') || "";
    this.apartment$ = this.apartmentS.getApartment(apartmentId);
  
    this.user$ = this.userS.getUser();

   this.sharedS.range.subscribe(range => {
     this.range = range; 
       const numberOfms = range.checkOut.getTime() - range.checkIn.getTime();
       this.numberOfDays = Math.round(numberOfms/(1000*3600*24));
      });
   }

 
  finish(userId: string, apartmentId: string, checkIn: Date, checkOut: Date) {
   
    if(!checkIn || !checkOut) {
      alert("Please enter a valid CheckIn/CheckOut date");
      this.router.navigate(['/apartments/'+ apartmentId]);
     }
     
     else {
      const reservation = { userId, apartmentId, checkIn, checkOut } //userId: userId...
      this.reservationS.addReservation(reservation).subscribe();
      alert('Thank You for Your Reservation')
      this.router.navigate(['/']);   
     }
  }

}
