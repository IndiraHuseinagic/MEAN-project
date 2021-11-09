import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let reservationS: ReservationService;
  let httpMock: HttpTestingController;

  let REST_API: string = environment.baseUrl + '/reservations';
  let REST_API_ID = environment.baseUrl + '/reservations/1';

  const mockValueReservations = [
    { _id: 1, apartment: { title: 'Apartment1' }, user: { name: 'User1' } },
    { _id: 2, apartment: { title: 'Apartment2' }, user: { name: 'User2' } }];

  const mockValueReservation = {
    _id: 1, apartment: { title: 'Apartment1' }, user: { name: 'User1' }
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    reservationS = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(reservationS).toBeTruthy();
  });

  //GET
  it('should get all reservations', () => {
    reservationS.getAllReservations().subscribe(reservations => {
      expect(reservations[0].apartment.title).toBe('Apartment1')
      expect(reservations[0].user.name).toBe('User1')
    });

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueReservations);
  })

  //GET /:id
  it('should get reservation with given ID', () => {
    reservationS.getReservation(1).subscribe(reservation => {
      expect(reservation.apartment.title).toBe('Apartment1')
      expect(reservation.user.name).toBe('User1')
    })

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueReservation);
  })

  //GET /my
  it('should get reservation for logged user', () => {
    reservationS.getReservationsByUser().subscribe(reservations => {
      expect(reservations[0].apartment.title).toBe('Apartment1')
      expect(reservations[1].user.name).toBe('User2')
    })

    let REST_API_my: string = environment.baseUrl + '/reservations/my';
    const req = httpMock.expectOne(REST_API_my);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueReservations);
  })

  //POST
  it('should add reservation', () => {
    reservationS.addReservation({ apartment: 'Apartment1', user: 'User1' })
      .subscribe(reservation => {
        expect(reservation.apartment.title).toBe('Apartment1')
        expect(reservation.user.name).toBe('User1')
      })

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueReservation);
  })

  //DELETE
  it('should delete reservation with given ID', () => {
    reservationS.deleteReservation(1).subscribe(reservation => {
      expect(reservation.apartment.title).toBe('Apartment1')
      expect(reservation.user.name).toBe('User1')
    })

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueReservation);
  })
});
