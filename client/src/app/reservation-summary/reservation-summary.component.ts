import { ReservationService } from './../reservation.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Reservation } from '../models/reservation';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-reservation-summary',
  templateUrl: './reservation-summary.component.html',
  styleUrls: ['./reservation-summary.component.css']
})
export class ReservationSummaryComponent {
  reservation$: Observable<Reservation>; 
  reservationId: string;

  constructor(
    private route: ActivatedRoute, 
    private reservationS: ReservationService, 
    private navigation: NavigationService) { 
      
     this.reservationId = this.route.snapshot.paramMap.get('id') || "";
     this.reservation$ = this.reservationS.getReservation(this.reservationId);
  }


  back(){
    this.navigation.back();
  }

  delete() {
    alert("Are You sure You want to cancel this reservation?");
    this.reservationS.deleteReservation(this.reservationId).subscribe();
    this.navigation.back();
  }

}
