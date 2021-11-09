import { RouterTestingModule } from '@angular/router/testing';
import { ApartmentService } from './../apartment.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApartmentsComponent } from './admin-apartments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AdminApartmentsComponent', () => {
  let component: AdminApartmentsComponent;
  let fixture: ComponentFixture<AdminApartmentsComponent>;
  let apartmentS: ApartmentService;

  const mockValueApartments = [{
    _id: '1',
    title: 'old town',
    category: { name: 'category1', _id: '10' },
    imageUrl: 'imageUrl',
    address: 'Munich',
    guests: 4,
    area: 50,
    unavailable: [{
      checkIn: new Date('2021/11/11'),
      checkOut: new Date('2021/11/12')
    }],
    dailyPrice: 100
  },
  {
    _id: '2',
    title: 'new apartment',
    category: { name: 'category1', _id: '11' },
    imageUrl: 'imageUrl',
    address: 'Munich',
    guests: 4,
    area: 50,
    unavailable: [{
      checkIn: new Date('2021/11/11'),
      checkOut: new Date('2021/11/12')
    }],
    dailyPrice: 100
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminApartmentsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ApartmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminApartmentsComponent);
    component = fixture.componentInstance;
    apartmentS = TestBed.inject(ApartmentService);

    apartmentS.getAllApartments = jasmine.createSpy().and.returnValue(of(mockValueApartments));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set apartments and filtered apartments to all apartments', () => {

    component.apartments$.subscribe(a =>
      expect(a).toEqual(mockValueApartments));

    component.filteredApartments$.subscribe(fa =>
      expect(fa).toEqual(mockValueApartments));
  });

  it('should return filtered apartments if filter is defined', () => {

    component.filter('new');

    component.filteredApartments$.subscribe(fa =>
      expect(fa).toEqual([mockValueApartments[1]]));
  });

  it('should return all apartments if filter is not defined', () => {

    component.filter('');

    component.filteredApartments$.subscribe(fa =>
      expect(fa).toEqual(mockValueApartments));
  });

});
