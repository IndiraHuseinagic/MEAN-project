import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let dateS: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    dateS = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(dateS).toBeTruthy();
  });

  it('should change checkInSubject if changeCheckIn method is called', () => {
    let date = new Date('2021/11/11');
    dateS.changeCheckIn(date);

    expect(dateS.checkInSubject.value).toBe(date);
  });

  it('should change checkOutSubject if changeCheckOut method is called', () => {
    let date = new Date('2021/11/11');
    dateS.changeCheckOut(date);

    expect(dateS.checkOutSubject.value).toBe(date);
  });

  it('should return next day', () => {
    let date = new Date('2021/11/20');

    let result = dateS.nextDay(date);

    expect(result.getDate()).toBe(21);
  });

  it('should return previous day', () => {
    let date = new Date('2021/11/20');

    let result = dateS.previousDay(date);

    expect(result.getDate()).toBe(19);
  });

  it('should return difference in days', () => {
    let date1 = new Date('2021/11/20');
    let date2 = new Date('2021/11/25');

    let result = dateS.daysDiff(date1, date2);

    expect(result).toBe(5);
  });

  it('should return true if dates overlap with given range', () => {
    let range = [{ checkIn: '2021/11/18', checkOut: '2021/11/22' }];
    let date1 = '2021/11/20';
    let date2 = '2021/11/25';

    let result = dateS.overlap(range, date1, date2);

    expect(result).toBe(true);
  });

});
