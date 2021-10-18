import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public range = new BehaviorSubject<any>([]);
  public currentRange = this.range.asObservable();

  constructor() { }

  changeRange(dateRange: any) {
    this.range.next(dateRange);
  }
  
}
