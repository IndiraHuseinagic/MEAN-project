import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit{
apartments: any;
queryCheckIn: string ="";
queryCheckOut: string ="";
guests: string ="";
category: string = "";

toShow:any[] = [];
number: any[] =[];
onNum: number=0;
biggest: any;

  constructor(
    private apartmentS: ApartmentService, 
    private route: ActivatedRoute) {}

  ngOnInit(){
    this.populateApartments();
  }

   private populateApartments() { 
    this.apartmentS.getAllApartments()
      .pipe(switchMap(apartments => {
        this.apartments = apartments;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.queryCheckIn= params.get('checkIn') || "";
        this.queryCheckOut = params.get('checkOut') || "";
        this.guests = params.get('guests') || "";
        this.category = params.get('category') || "";
        this.applyFilter();      
      });
  }

  private applyFilter() { 

    if(this.queryCheckIn && this.queryCheckOut) 
      this.apartments = this.apartments.filter((a: { unavailable: { checkOut: string; checkIn: string; }[]; }) => !this.overlap(a.unavailable));
 
    if(this.guests && this.guests!=="Guests")
    this.apartments =  this.apartments.filter((a: { guests: number; })=> a.guests === +this.guests); 
 
    if(this.category)
      this.apartments =  this.apartments.filter((a: { category: { name: string; }; }) => a.category.name === this.category); 
 
    }

  private overlap(ranges: any){   
   return ranges.some((range: { checkOut: string; checkIn: string; }) =>
     (Math.min(new Date(range.checkOut).getTime(), 
               new Date(this.queryCheckOut).getTime())-
      Math.max(new Date(range.checkIn).getTime(),  
               new Date(this.queryCheckIn).getTime()))>0); 
  }


}


