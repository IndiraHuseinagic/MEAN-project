import { Observable, of } from 'rxjs';
import { ReservationService } from './../reservation.service';
import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation';


@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  reservations$!: Observable<Reservation[]>;

  constructor(private reservationS: ReservationService) { }

  ngOnInit() {
    this.reservations$ = this.reservationS.getReservationsByUser();
  }

}
