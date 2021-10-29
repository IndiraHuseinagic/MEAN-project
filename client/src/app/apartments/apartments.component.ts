import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Apartment } from '../models/apartment';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit{
apartments$: Observable<Apartment[]>;


  constructor(
    private apartmentS: ApartmentService, 
    private route: ActivatedRoute) {

      this.apartments$ = this.apartmentS.getAllApartments();
    }

  ngOnInit(){
    this.populateApartments();
  }

   private populateApartments() { 
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
       const filter = {
           checkIn:  params.get('checkIn') || "",
           checkOut: params.get('checkOut') || "",
           guests:   params.get('guests') || "",
           category: params.get('category') || ""}
      this.applyFilter(filter);      
    });
  }

  private applyFilter(f: any) {  
    
       this.apartments$ = this.apartments$.pipe(map(apartments =>{
         
        if(f.checkIn && f.checkOut) 
           apartments = apartments.filter(a => !this.overlap(a.unavailable, f.checkIn, f.checkOut));

        if(f.guests) 
          apartments = apartments.filter(a=> a.guests === +f.guests);
          
        if(f.category)
          apartments =  apartments.filter(a => a.category.name === f.category);

          return apartments;
       }))
   }


  private overlap(ranges: any, checkIn: string, checkOut: string){   
   return ranges.some((range: { checkIn: string; checkOut: string })  =>
     (Math.min(new Date(range.checkOut).getTime(), 
               new Date(checkOut).getTime())-
      Math.max(new Date(range.checkIn).getTime(),  
               new Date(checkIn).getTime()))>0); 
  }





}


