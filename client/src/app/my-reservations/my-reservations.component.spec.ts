import { RouterTestingModule } from '@angular/router/testing';
import { ReservationService } from './../reservation.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyReservationsComponent } from './my-reservations.component';
import { of } from 'rxjs';


describe('MyReservationsComponent', () => {
  let component: MyReservationsComponent;
  let fixture: ComponentFixture<MyReservationsComponent>;
  let reservationS: ReservationService;

  const mockValueReservations = [{
    _id: '1',
    user: {
        _id: '11',
        name: 'user1',
        email: 'user1@gmail.com',
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
      declarations: [ MyReservationsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ ReservationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationsComponent);
    component = fixture.componentInstance;
    reservationS = TestBed.inject(ReservationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return reservations for given user', () => {

    reservationS.getReservationsByUser = jasmine.createSpy().and.returnValue(of(mockValueReservations));
    fixture.detectChanges();
    
    component.reservations$.subscribe(r => 
      expect(r).toEqual(mockValueReservations));
  });

});
