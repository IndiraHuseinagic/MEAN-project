import { ReservationService } from './../reservation.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-reservation-summary',
  templateUrl: './reservation-summary.component.html',
  styleUrls: ['./reservation-summary.component.css']
})
export class ReservationSummaryComponent implements OnInit {
  reservation$!: Observable<Reservation>;
  reservationId!: string;

  constructor(
    private route: ActivatedRoute,
    private reservationS: ReservationService,
    private navigationS: NavigationService) { }

  ngOnInit() {
    this.reservationId = this.route.snapshot.paramMap.get('id') || "";
    this.reservation$ = this.reservationS.getReservation(this.reservationId);
  }

  back() {
    this.navigationS.back();
  }

  delete() {
    if (!confirm("Are You sure You want to cancel this reservation?")) return;

    this.reservationS.deleteReservation(this.reservationId).subscribe();
    this.navigationS.back();
  }

}
