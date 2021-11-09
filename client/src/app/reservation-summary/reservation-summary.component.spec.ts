import { RouterTestingModule } from '@angular/router/testing';
import { ReservationService } from './../reservation.service';
import { NavigationService } from './../navigation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ReservationSummaryComponent } from './reservation-summary.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';


describe('ReservationSummaryComponent', () => {
  let component: ReservationSummaryComponent;
  let fixture: ComponentFixture<ReservationSummaryComponent>;
  let route: ActivatedRoute;
  let reservationS: ReservationService;
  let navigationS: NavigationService;

  const mockValueReservation = {
    _id: '1',
    user: {
      _id: '2',
      name: 'user2',
      email: 'user2@gmail.com',
      phone: '12345'
    },
    apartment: {
      _id: '3',
      title: 'Apartment3',
      imageUrl: 'imageUrl',
      address: 'Munich',
      dailyPrice: 100
    },
    checkIn: new Date('2021/11/11'),
    checkOut: new Date('2021/11/12'),
    rentalFee: 100
  };

  let mockActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: '1'
      })
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationSummaryComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ReservationService, NavigationService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationSummaryComponent);
    component = fixture.componentInstance;
    reservationS = TestBed.inject(ReservationService);
    route = TestBed.inject(ActivatedRoute);
    navigationS = TestBed.inject(NavigationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return reservation for given reservation ID', () => {
    let id = route.snapshot.paramMap.get('id') || '';
    reservationS.getReservation = jasmine.createSpy().withArgs(id).and.returnValue(of(mockValueReservation));
    fixture.detectChanges();

    component.reservation$.subscribe(r =>
      expect(r).toEqual(mockValueReservation));
  });

  describe('delete()', () => {

    it('should call confirm window when deleting reservation', () => {
      window.confirm = jasmine.createSpy();

      component.delete();

      expect(window.confirm).toHaveBeenCalledWith("Are You sure You want to cancel this reservation?");
    });

    it('should not call delete and back methods if user cancels', () => {
      window.confirm = jasmine.createSpy().and.returnValue(false);
      reservationS.deleteReservation = jasmine.createSpy();
      navigationS.back = jasmine.createSpy();

      component.delete();

      expect(reservationS.deleteReservation).not.toHaveBeenCalled();
      expect(navigationS.back).not.toHaveBeenCalled();
    })

    it('should delete reservation and navigate back if user confirms', () => {
      window.confirm = jasmine.createSpy().and.returnValue(true);
      reservationS.deleteReservation = jasmine.createSpy().and.returnValue(of(mockValueReservation));
      navigationS.back = jasmine.createSpy();
      component.reservationId = route.snapshot.paramMap.get('id') || ''

      component.delete();

      expect(reservationS.deleteReservation).toHaveBeenCalledWith('1');
      expect(navigationS.back).toHaveBeenCalled();
    })
  })

  it('should return back when back button is clicked', () => {
    let id = route.snapshot.paramMap.get('id') || '';
    reservationS.getReservation = jasmine.createSpy().withArgs(id).and.returnValue(of(mockValueReservation));
    fixture.detectChanges();
    component.back = jasmine.createSpy();

    let button = fixture.debugElement.query(By.css('.btn-back'));

    button.triggerEventHandler('click', null);

    expect(component.back).toHaveBeenCalled();
  })

});
