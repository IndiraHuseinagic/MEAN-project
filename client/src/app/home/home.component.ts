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
  guests: string= "Guests";
  d: any;

  constructor(
    private categoryS: CategoryService, 
    private router: Router,
    private dateS: DateService) { 

    this.d = this.dateS.limits();
    this.categories$ = this.categoryS.getAllCategories();  
  };
 
checkInChange(){
  this.d.min2 = this.dateS.changeDay(this.checkIn, 1);
}

checkOutChange(){
  this.d.max1 = this.dateS.changeDay(this.checkOut, -1);
}

search(){
 this.router.navigate(['/apartments'], {queryParams: 
  {checkIn: this.checkIn.toDateString(), 
   checkOut: this.checkOut.toDateString(), 
   guests: this.guests
 }})
}


}