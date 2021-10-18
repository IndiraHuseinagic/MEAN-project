import { Observable } from 'rxjs';
import { ReservationService } from './../reservation.service';
import { Component } from '@angular/core';
import { Reservation } from '../models/reservation';


@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent {
 reservations$: Observable<Reservation []>;
 
  constructor( private reservationS: ReservationService) { 
     this.reservations$ =  this.reservationS.getReservationsByUser(); 
}    


}
