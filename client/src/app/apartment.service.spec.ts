import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ApartmentService } from './apartment.service';

describe('ApartmentService', () => {
  let apartmentS: ApartmentService;
  let httpMock: HttpTestingController;

  let REST_API: string = environment.baseUrl + '/apartments';
  let REST_API_ID = environment.baseUrl + '/apartments/1';

  const mockValueApartments = [
    {_id: 1, title: 'Apartment1' },
    {_id: 2, title: 'Apartment2' }];

  const mockValueApartment = {
    _id: 1, title: 'Apartment1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApartmentService]
    });
    apartmentS = TestBed.inject(ApartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(()=> {
    httpMock.verify();
  }) 

  it('should be created', () => {
    expect(apartmentS).toBeTruthy();
  });

  //GET
  it('should get all apartments', ()=> {
    apartmentS.getAllApartments().subscribe(apartments => 
     expect(apartments[0].title).toBe('Apartment1'));

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('GET');
        
    req.flush(mockValueApartments)
  })

  //GET /:id
  it('should get apartment with given ID', ()=> {
    apartmentS.getApartment(1).subscribe(apartment =>
      expect(apartment.title).toBe('Apartment1'))

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockValueApartment);
  })

  //POST
  it('should add apartment', ()=> {
    apartmentS.addApartment({title: 'Apartment1'}).subscribe(apartment =>
      expect(apartment.title).toBe('Apartment1'))

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();
    
    req.flush(mockValueApartment);
  })

  //PUT
  it('should update apartment with given ID', ()=> {
    apartmentS.updateApartment(1, {title: 'Apartment1'}).subscribe(apartment => {
       expect(apartment.title).toBe('Apartment1')
     })

     const req = httpMock.expectOne(REST_API_ID);
     expect(req.request.method).toBe('PUT');
     expect(req.request.headers.get('Content-Type')).toBe('application/json')
     expect(req.request.headers.has('x-auth-token')).toBeTrue();

     req.flush(mockValueApartment);
    })

  //DELETE
  it('should delete apartment with given ID', ()=> {  
    apartmentS.deleteApartment(1).subscribe(apartment => {
      expect(apartment.title).toBe('Apartment1')
    })

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();
     
    req.flush(mockValueApartment);
   })

});
