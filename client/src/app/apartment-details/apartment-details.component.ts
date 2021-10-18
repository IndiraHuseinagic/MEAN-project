import { DateService } from './../date.service';
import { ApartmentService } from './../apartment.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-apartment-details',
  templateUrl: './apartment-details.component.html',
  styleUrls: ['./apartment-details.component.css']
})
export class ApartmentDetailsComponent  {
apartmentId: string;
apartment: any;
ranges: any[] = []; 
rangeFilter: any;

checkIn!: Date;
checkOut!: Date;
d: any;

validationMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apartmentS: ApartmentService,
    private sharedS: SharedService, 
    private router: Router,
    private dateS: DateService) {

    this.apartmentId = this.route.snapshot.paramMap.get('id') || "";
    this.apartmentS.getApartment(this.apartmentId).pipe(take(1)).subscribe(a => {
       this.apartment = a;
       this.ranges = a.unavailable;
    }); 
    
    this.d = this.dateS.limits();
    
    this.rangeFilter = (d: Date | null) : Boolean => {
      if(!d) return false;
      
      else { return !this.ranges.some(range =>
            d >= new Date(range.checkIn) && 
            d <= new Date(range.checkOut))
      }
    }
  }
  
  checkInChange(checkIn: any | null){
    this.d.min2 = this.dateS.changeDay(checkIn, 1);
    this.checkIn = checkIn;
    this.sharedS.changeRange({
      checkIn: this.checkIn,
      checkOut: this.checkOut});
  }
  
  checkOutChange(checkOut: any | null){
    this.d.max1 = this.dateS.changeDay(checkOut, -1);
    this.checkOut = checkOut;
    this.sharedS.changeRange({
      checkIn: this.checkIn, 
      checkOut: this.checkOut});
  }

 reserve(){
  if(!this.checkIn || !this.checkOut) {
    this.validationMessage = true;
   }

   else {
    this.validationMessage = false;
    this.router.navigate(['/apartments/reservation/' + this.apartmentId]);
   }
 }


}
