import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReservationService } from '../reservation.service';
import { AdminReservationsComponent } from './admin-reservations.component';

describe('AdminReservationsComponent', () => {
  let component: AdminReservationsComponent;
  let fixture: ComponentFixture<AdminReservationsComponent>;
  let reservationS: ReservationService;

  const mockValueReservations = [{
    _id: '1',
    user: {
      _id: '11',
      name: '12345',
      email: 'email@gmail.com',
      phone: '12345'
    },
    apartment: {
      _id: '22',
      title: 'Apartment1',
      imageUrl: 'imageUrl',
      address: 'Munich',
      dailyPrice: 100
    },
    checkIn: new Date('2021/11/11'),
    checkOut: new Date('2021/11/12'),
    rentalFee: 100
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminReservationsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ReservationService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReservationsComponent);
    component = fixture.componentInstance;
    reservationS = TestBed.inject(ReservationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all reservations for admin user', () => {

    reservationS.getAllReservations = jasmine.createSpy().and.returnValue(of(mockValueReservations));
    fixture.detectChanges();

    component.reservations$.subscribe(r =>
      expect(r).toEqual(mockValueReservations));
  });
});
