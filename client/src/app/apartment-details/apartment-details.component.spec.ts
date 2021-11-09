import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { ApartmentService } from '../apartment.service';
import { DateService } from '../date.service';

import { ApartmentDetailsComponent } from './apartment-details.component';

describe('ApartmentDetailsComponent', () => {
  let component: ApartmentDetailsComponent;
  let fixture: ComponentFixture<ApartmentDetailsComponent>;
  let apartmentS: ApartmentService;
  let dateS: DateService;
  let router: Router;
  let route: ActivatedRoute;

  const mockValueApartment = {
    _id: '1',
    title: 'Apartment1',
    category: { _id: '11', name: 'category1' },
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApartmentDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        ApartmentService, DateService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentDetailsComponent);
    component = fixture.componentInstance;
    apartmentS = TestBed.inject(ApartmentService);
    dateS = TestBed.inject(DateService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return apartment and unavailable ranges for given apartment ID', () => {
    let id = route.snapshot.paramMap.get('id') || '';
    apartmentS.getApartment = jasmine.createSpy().withArgs(id).and.returnValue(of(mockValueApartment));
    fixture.detectChanges();

    apartmentS.getApartment(id).subscribe(a => {
      expect(component.apartment).toEqual(a);
      expect(component.ranges).toEqual(a.unavailable)
    })
  });

  it('should change min limit of checkOut datepicker when checkIn changes', () => {
    let checkIn = new Date('2021/11/11');
    dateS.nextDay = jasmine.createSpy().and.returnValue(new Date('2021/11/12'));
    dateS.changeCheckIn = jasmine.createSpy();
    fixture.detectChanges();

    component.checkInChange(checkIn);

    expect(component.d.min2).toEqual(new Date('2021/11/12'));
    expect(component.checkIn).toEqual(checkIn);
    expect(dateS.changeCheckIn).toHaveBeenCalled();
  });

  it('should change max limit of checkIn datepicker when checkOut changes', () => {
    let checkOut = new Date('2021/11/11');
    dateS.previousDay = jasmine.createSpy().and.returnValue(new Date('2021/11/10'));
    dateS.changeCheckOut = jasmine.createSpy();
    fixture.detectChanges();

    component.checkOutChange(checkOut);

    expect(component.d.max1).toEqual(new Date('2021/11/10'));
    expect(component.checkOut).toEqual(checkOut);
    expect(dateS.changeCheckOut).toHaveBeenCalled();
  });

  it('should show validation error message if checkIn and checkOut are not defined', () => {

    component.reserve();

    expect(component.validationMessage).toBeTrue();
  });

  it('should hide validation error message and navigate to /apartments/reservation/apartmentId if checkIn and checkOut are defined', () => {
    component.checkIn = new Date('2021/11/11');
    component.checkOut = new Date('2021/11/13');
    component.apartmentId = route.snapshot.paramMap.get('id') || '';

    component.reserve();

    expect(component.validationMessage).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/apartments/reservation/' + component.apartmentId]);
  });

  it('should return min and max limits for date picker', () => {
    let limits = {
      min1: new Date(),
      max1: new Date(),
      min2: new Date(),
      max2: new Date()
    }
    dateS.minMaxLimits = jasmine.createSpy().and.returnValue(limits);
    fixture.detectChanges();

    expect(component.d).toBe(limits);
  });

  it('should render validation error message if checkIn and checkOut are not defined', () => {
    component.validationMessage = true;
    component.apartment = mockValueApartment;
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.error'));

    expect(de.nativeElement.innerText).toContain('Please enter a valid CheckIn/CheckOut date');
  });
});
