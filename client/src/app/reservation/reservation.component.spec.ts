import { DateService } from './../date.service';
import { ApartmentService } from './../apartment.service';
import { UserService } from './../user.service';
import { ReservationService } from './../reservation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;
  let reservationS: ReservationService;
  let userS: UserService;
  let apartmentS: ApartmentService;
  let dateS: DateService;
  let router: Router;
  let route: ActivatedRoute;

  let mockActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: '1'
      })
    }
  };

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

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

  const mockValueUser = {
    _id: '2',
    name: 'user2',
    email: 'user1@gmail.com',
    phone: '12345',
    isAdmin: true
  };

  const mockValueApartment = {
    _id: '3',
    title: 'Apartment3',
    category: { _id: '33', name: 'category1' },
    imageUrl: 'imageUrl',
    address: 'Munich',
    guests: 4,
    area: 50,
    unavailable: [
      {
        checkIn: new Date('2021/11/11'),
        checkOut: new Date('2021/11/12')
      }],
    dailyPrice: 60
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationComponent],
      imports: [HttpClientTestingModule],
      providers: [
        ReservationService, UserService, ApartmentService, DateService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    reservationS = TestBed.inject(ReservationService);
    apartmentS = TestBed.inject(ApartmentService);
    userS = TestBed.inject(UserService);
    dateS = TestBed.inject(DateService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return apartment for given apartment ID', () => {
    let id = route.snapshot.paramMap.get('id') || '';
    apartmentS.getApartment = jasmine.createSpy().withArgs(id).and.returnValue(of(mockValueApartment));
    fixture.detectChanges();

    component.apartment$.subscribe(a =>
      expect(a).toEqual(mockValueApartment));
  });

  it('should return user for given token', () => {
    userS.getUser = jasmine.createSpy().and.returnValue(of(mockValueUser));
    fixture.detectChanges();

    component.user$.subscribe(u =>
      expect(u).toEqual(mockValueUser));
  });

  it('should alert message when new reservation is successfully completed', () => {
    let userId = '2';
    let apartmentId = '3';
    let checkIn = new Date('2021/11/11');
    let checkOut = new Date('2021/11/12');

    const reservationArg = { userId, apartmentId, checkIn, checkOut };
    reservationS.addReservation = jasmine.createSpy().withArgs(reservationArg).and.returnValue(of(mockValueReservation));
    window.alert = jasmine.createSpy();
    fixture.detectChanges();

    component.finish(userId, apartmentId, checkIn, checkOut);

    expect(window.alert).toHaveBeenCalledWith("Thank You for Your Reservation");
  });

  it('should navigate to home page when new reservation is completed', () => {
    let userId = '2';
    let apartmentId = '3';
    let checkIn = new Date('2021/11/11');
    let checkOut = new Date('2021/11/12');

    const reservationArg = { userId, apartmentId, checkIn, checkOut };
    reservationS.addReservation = jasmine.createSpy().withArgs(reservationArg).and.returnValue(of(mockValueReservation));
    fixture.detectChanges();

    component.finish(userId, apartmentId, checkIn, checkOut);

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should alert error message if reservation is not valid', () => {
    let userId = '22222';
    let apartmentId = '3';
    let checkIn = new Date('2021/11/11');
    let checkOut = new Date('2021/11/12');

    const error = 'user with given userId not found';
    reservationS.addReservation = jasmine.createSpy().and.returnValue(throwError(error));
    window.alert = jasmine.createSpy();
    fixture.detectChanges();

    component.finish(userId, apartmentId, checkIn, checkOut);

    expect(window.alert).toHaveBeenCalledWith(error);
  });

  it('should navigate to apartments/:id when reservation fails', () => {
    let userId = '22222';
    let apartmentId = '3';
    let checkIn = new Date('2021/11/11');
    let checkOut = new Date('2021/11/12');

    const error = 'user with given userId not found';
    reservationS.addReservation = jasmine.createSpy().and.returnValue(throwError(error));
    fixture.detectChanges();

    component.finish(userId, apartmentId, checkIn, checkOut);

    expect(router.navigate).toHaveBeenCalledWith(['/apartments/' + apartmentId]);
  });

  it('should return number of days between checkIn and checkOut', () => {
    dateS.daysDiff = jasmine.createSpy().and.returnValue(1);
    fixture.detectChanges();

    expect(component.daysDiff).toBe(1);
  });

});
