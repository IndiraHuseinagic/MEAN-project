import { ApartmentService } from './../apartment.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Apartment } from '../models/apartment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-apartments',
  templateUrl: './admin-apartments.component.html',
  styleUrls: ['./admin-apartments.component.css']
})
export class AdminApartmentsComponent implements OnInit {
  apartments$!: Observable<Apartment[]>;
  filteredApartments$!: Observable<Apartment[]>;

  constructor(private apartmentS: ApartmentService) { }

  ngOnInit() {
    this.apartments$ = this.apartmentS.getAllApartments();
    this.filteredApartments$ = this.apartments$;
  }

  filter(query: string) {
    this.filteredApartments$ = (query) ? this.apartments$.pipe(map(apartments =>
      apartments.filter(x => x.title.toLowerCase().includes(query.toLowerCase())))) : this.apartments$;
  }

}
