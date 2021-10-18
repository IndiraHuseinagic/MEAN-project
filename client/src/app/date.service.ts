import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
 
  constructor() { }

  limits(){
   const date ={
      min1: new Date(),
      max1: new Date( new Date().getFullYear() + 1, 11, 30), 
      min2: this.changeDay(new Date(), 1),
      max2: new Date( new Date().getFullYear() + 1, 11, 31)
   }
   return date;
  }

  changeDay(day: Date, offset: number){
    let changeDay = new Date();
    changeDay.setDate(day.getDate() + offset); 
    return changeDay;
  }
}
