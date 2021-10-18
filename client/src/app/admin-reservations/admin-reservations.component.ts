import { ReservationService } from './../reservation.service';
import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {
reservations$: Observable<Reservation[]>;

  constructor(private reservationS: ReservationService) { 
    this.reservations$ = this.reservationS.getAllReservations();
  }

  ngOnInit(): void {
  }

}
