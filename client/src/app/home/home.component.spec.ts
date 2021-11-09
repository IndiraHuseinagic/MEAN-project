import { CategoryService } from './../category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DateService } from '../date.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let categoryS: CategoryService;
  let dateS: DateService;
  let router: Router;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        CategoryService, DateService,
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    categoryS = TestBed.inject(CategoryService);
    dateS = TestBed.inject(DateService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all categories', () => {
    const categories = [{ _id: '1', name: 'category1' }, { _id: '2', name: 'category2' }];

    categoryS.getAllCategories = jasmine.createSpy().and.returnValue(of(categories));
    fixture.detectChanges();

    component.categories$.subscribe(c => {
      expect(c).toEqual(categories)
    });
  });

  it('should navigate to /apartments with query params set to selected checkIn, checkOut and guests', () => {
    component.checkIn = new Date('2021/11/11');
    component.checkOut = new Date('2021/11/12');
    component.guests = 4;

    fixture.detectChanges();

    component.search();

    expect(router.navigate).toHaveBeenCalledWith(['/apartments'], {
      queryParams: {
        checkIn: new Date('2021/11/11').toDateString(),
        checkOut: new Date('2021/11/12').toDateString(),
        guests: 4
      }
    });
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

  it('should change min limit of checkOut datepicker when checkIn changes', () => {
    let date = new Date();
    dateS.nextDay = jasmine.createSpy().and.returnValue(date);
    fixture.detectChanges();

    component.checkInChange();

    expect(component.d.min2).toBe(date);
  });

  it('should change max limit of checkIn datepicker when checkOut changes', () => {
    let date = new Date();
    dateS.previousDay = jasmine.createSpy().and.returnValue(date);
    fixture.detectChanges();

    component.checkOutChange();

    expect(component.d.max1).toBe(date);
  });
});



