import { DateService } from './../date.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Apartment } from '../models/apartment';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {
  apartments$!: Observable<Apartment[]>;


  constructor(
    private apartmentS: ApartmentService,
    private route: ActivatedRoute,
    private dateS: DateService) { }

  ngOnInit() {
    this.apartments$ = this.apartmentS.getAllApartments();
    this.route.queryParamMap.pipe(first()).subscribe(params => {
      const filter = {
        checkIn: params.get('checkIn') || "",
        checkOut: params.get('checkOut') || "",
        guests: params.get('guests') || "",
        category: params.get('category') || ""
      }
      this.applyFilter(filter);
    });
  }

  private applyFilter(f: any) {

    this.apartments$ = this.apartments$.pipe(map(apartments => {

      if (f.checkIn && f.checkOut)
        apartments = apartments.filter(a => !this.dateS.overlap(a.unavailable, f.checkIn, f.checkOut));

      if (f.guests)
        apartments = apartments.filter(a => a.guests === +f.guests);

      if (f.category)
        apartments = apartments.filter(a => a.category.name === f.category);

      return apartments;
    }))
  }

}


