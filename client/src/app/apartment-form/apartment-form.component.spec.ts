import { ApartmentService } from './../apartment.service';
import { CategoryService } from './../category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ApartmentFormComponent } from './apartment-form.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ApartmentFormComponent', () => {
  let component: ApartmentFormComponent;
  let fixture: ComponentFixture<ApartmentFormComponent>;
  let categoryS: CategoryService;
  let apartmentS: ApartmentService;
  let route: ActivatedRoute;
  let router: Router;

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
      declarations: [ApartmentFormComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        ApartmentService, CategoryService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentFormComponent);
    component = fixture.componentInstance;
    categoryS = TestBed.inject(CategoryService);
    apartmentS = TestBed.inject(ApartmentService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all categories', () => {
    const categories = [{ _id: '11', name: 'category1' }, { _id: '22', name: 'category2' }];

    categoryS.getAllCategories = jasmine.createSpy().and.returnValue(of(categories));
    fixture.detectChanges();

    component.categories$.subscribe(c => {
      expect(c).toEqual(categories)
    });
  });

  it('should return apartment if apartment ID is defined', () => {
    let newApartment = {
      title: 'Apartment1',
      imageUrl: 'imageUrl',
      address: 'Munich',
      guests: 4,
      area: 50,
      unavailable: [
        {
          checkIn: new Date('2021/11/11'),
          checkOut: new Date('2021/11/12')
        }],
      dailyPrice: 60,
      categoryId: '11'
    }; //no _id and category

    let apartmentId = route.snapshot.paramMap.get('id') || '';
    apartmentS.getApartment = jasmine.createSpy().withArgs(apartmentId).and.returnValue(of(mockValueApartment));
    fixture.detectChanges();

    expect(component.apartment).toEqual(newApartment);
  });

  describe('save()', () => {
    it('should navigate to admin/apartments if apartment is sucessfully updated', () => {
      component.apartmentId = route.snapshot.paramMap.get('id') || ''
      apartmentS.updateApartment = jasmine.createSpy().and.returnValue(of(mockValueApartment));

      component.save();

      expect(router.navigate).toHaveBeenCalledWith(['admin/apartments']);
    });

    it('should throw error message if apartment can not be updated', () => {
      component.apartmentId = route.snapshot.paramMap.get('id') || ''
      const error = 'title must have at least 5 charachers';
      apartmentS.updateApartment = jasmine.createSpy().and.returnValue(throwError(error));

      component.save();

      expect(component.errorMessage).toBe(error);
    });

    it('should navigate to admin/apartments if apartment is sucessfully added', () => {
      component.apartmentId = "";
      apartmentS.addApartment = jasmine.createSpy().and.returnValue(of(mockValueApartment));

      component.save();

      expect(router.navigate).toHaveBeenCalledWith(['admin/apartments']);
    });

    it('should throw error message if apartment can not be added', () => {
      component.apartmentId = "";
      const error = 'title must have at least 5 charachers';
      apartmentS.addApartment = jasmine.createSpy().and.returnValue(throwError(error));

      component.save();

      expect(component.errorMessage).toBe(error);
    });
  })

  describe('delete()', () => {
    it('should call confirm window when deleting apartment', () => {
      window.confirm = jasmine.createSpy();

      component.delete();

      expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this apartment?");
    });

    it('should not call delete method if user cancels', () => {
      window.confirm = jasmine.createSpy().and.returnValue(false);
      apartmentS.deleteApartment = jasmine.createSpy();

      component.delete();

      expect(apartmentS.deleteApartment).not.toHaveBeenCalled();
    })

    it('should delete apartment and navigate to admin/apartments if user confirms', () => {
      window.confirm = jasmine.createSpy().and.returnValue(true);
      apartmentS.deleteApartment = jasmine.createSpy().and.returnValue(of(mockValueApartment));
      component.apartmentId = route.snapshot.paramMap.get('id') || ''

      component.delete();

      expect(apartmentS.deleteApartment).toHaveBeenCalledWith(component.apartmentId);
      expect(router.navigate).toHaveBeenCalledWith(['admin/apartments']);
    })
  })

});
