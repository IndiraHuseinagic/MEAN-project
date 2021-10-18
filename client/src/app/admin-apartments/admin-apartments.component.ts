import { ApartmentService } from './../apartment.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apartment } from '../models/apartment';

@Component({
  selector: 'app-admin-apartments',
  templateUrl: './admin-apartments.component.html',
  styleUrls: ['./admin-apartments.component.css']
})
export class AdminApartmentsComponent implements OnInit {
  apartments!: Apartment[];
  filteredApartments!: Apartment[];
  subscription: Subscription;
 
   constructor(private apartmentS: ApartmentService) {
     this.subscription= this.apartmentS.getAllApartments().subscribe(apartments=> 
       this.filteredApartments = this.apartments = apartments);
    }
 
   ngOnInit(): void {
   }
 
   filter(query: string){
     this.filteredApartments= (query) ?  
     this.apartments.filter(x=> x.title.toLowerCase().includes(query.toLowerCase())) :
      this.apartments;
   }
 
   ngOnDestroy() {
   this.subscription.unsubscribe();
   }

}
