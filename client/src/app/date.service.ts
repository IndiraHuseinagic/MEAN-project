import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private checkInSubject = new BehaviorSubject<Date>(new Date(0));
  private checkOutSubject = new BehaviorSubject<Date>(new Date(0));

  constructor() { }

  changeCheckIn(date: Date) {
    this.checkInSubject.next(date);
  }

  changeCheckOut(date: Date) {
    this.checkOutSubject.next(date);
  }
  
  get checkInValue(){
    return this.checkInSubject.value;
  }
  get checkOutValue(){
    return this.checkOutSubject.value;
  }

  minMaxLimits(){
   return {
      min1: this.today(),
      max1: new Date(new Date().getFullYear() + 1, 11, 30), 
      min2: this.nextDay(this.today()),
      max2: new Date(new Date().getFullYear() + 1, 11, 31)
   }
  }

  today(){
    return new Date();
  }

  nextDay(day: Date){
    let dateString = day.toDateString();
    let d = new Date(dateString);
    let result = d.setDate(d.getDate() + 1);  
    return new Date(result);
  }

  previousDay(day: Date){
    let dateString = day.toDateString();
    let d = new Date(dateString);
    let result = d.setDate(d.getDate() -1);  
    return new Date(result);
  }

  daysDiff(start: Date, end: Date){
    return Math.round((end.getTime() - start.getTime())/(1000*3600*24));
  }
  
 

}
