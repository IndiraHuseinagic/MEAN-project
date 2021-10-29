import { DateService } from './../date.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  checkIn!: Date; 
  checkOut!: Date;
  categories$: Observable<any>; 
  guests = 0;
  d: any;

  constructor(
    private categoryS: CategoryService, 
    private router: Router,
    private dateS: DateService) { 

    this.d = this.dateS.minMaxLimits();
    this.categories$ = this.categoryS.getAllCategories();  
  };
 
checkInChange(){
  this.d.min2 = this.dateS.nextDay(this.checkIn);
}

checkOutChange(){
  this.d.max1 = this.dateS.previousDay(this.checkOut);
}

search(){
  const checkin = (this.checkIn) ? this.checkIn.toDateString() : "";
  const checkout = (this.checkOut) ? this.checkOut.toDateString() : "";
 
 this.router.navigate(['/apartments'], {queryParams: {
   checkIn:  checkin || null, 
   checkOut: checkout || null, 
   guests: this.guests || null
 }})
}


}