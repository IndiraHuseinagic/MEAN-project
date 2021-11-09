import { RouterTestingModule } from '@angular/router/testing';
import { ApartmentService } from './../apartment.service';
import { DateService } from './../date.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApartmentsComponent } from './apartments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ApartmentsComponent', () => {
  let component: ApartmentsComponent;
  let fixture: ComponentFixture<ApartmentsComponent>;
  let apartmentS: ApartmentService;
  
  const mockValueApartments = [{
      _id: '1', 
      title: 'Apartment1',
      category: {name: 'category1', _id: '11'},
      imageUrl: 'imageUrl',
      address: 'Munich',
      guests: 4,
      area: 50,
      unavailable: [{ 
        checkIn: new Date('2021/11/10'),
        checkOut: new Date('2021/11/15')}],
      dailyPrice: 100
      },
       {
      _id: '2', 
      title: 'Apartment2',
      category: {name: 'category2', _id: '22'},
      imageUrl: 'imageUrl',
      address: 'Munich',
      guests: 5,
      area: 60,
      unavailable: [{ 
        checkIn: new Date('2021/11/16'),
        checkOut: new Date('2021/11/20')}],
      dailyPrice: 80
      }];
  
  let mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParamMap']);
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartmentsComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ 
         ApartmentService, DateService,
        {provide: ActivatedRoute, useValue: mockActivatedRoute }
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentsComponent);
    component = fixture.componentInstance;
    apartmentS = TestBed.inject(ApartmentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all apartments if filter is not defined', () => { 
    let queryParams = convertToParamMap({
      checkIn: '',
      checkOut: '',
      guests: '',
      category: ''
    }); 

     apartmentS.getAllApartments = jasmine.createSpy().and.returnValue(of(mockValueApartments));
     mockActivatedRoute.queryParamMap = of(queryParams);
     fixture.detectChanges();
    
     component.apartments$.subscribe(a => 
     expect(a).toEqual(mockValueApartments));
  });

  it('should return filtered apartments if filter is defined', () => {
    let queryParams = convertToParamMap({
      checkIn: new Date('2021/11/11').toDateString(),
      checkOut: new Date('2021/11/15').toDateString(),
      guests: '5',
      category: 'category2'
    });

    apartmentS.getAllApartments = jasmine.createSpy().and.returnValue(of(mockValueApartments));
    mockActivatedRoute.queryParamMap = of(queryParams);
    
    fixture.detectChanges();
    
    component.apartments$.subscribe(a => 
      expect(a).toEqual([mockValueApartments[1]]))
  });

});
