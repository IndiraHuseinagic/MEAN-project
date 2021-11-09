import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let categoryS: CategoryService;
  let httpMock: HttpTestingController;

  let REST_API: string = environment.baseUrl + '/categories';
  let REST_API_ID = environment.baseUrl + '/categories/1';

  const mockValueCategories = [
    { _id: 1, name: 'Category1' },
    { _id: 2, name: 'Category2' }];

  const mockValueCategory = {
    _id: 1, name: 'Category1'
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    categoryS = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(categoryS).toBeTruthy();
  });

  //GET
  it('should get all categories', () => {
    categoryS.getAllCategories().subscribe(categories =>
      expect(categories[0].name).toBe('Category1'));

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('GET');

    req.flush(mockValueCategories);
  })

  //GET /:id
  it('should get category with given ID', () => {
    categoryS.getCategory(1).subscribe(category =>
      expect(category.name).toBe('Category1'))

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('GET');

    req.flush(mockValueCategory);
  })

  //POST
  it('should add category', () => {
    categoryS.addCategory({ name: 'Category1' }).subscribe(category =>
      expect(category.name).toBe('Category1'))

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueCategory);
  })

  //PUT
  it('should update category with given ID', () => {
    categoryS.updateCategory(1, { title: 'Category1' }).subscribe(category => {
      expect(category.name).toBe('Category1')
    })

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueCategory);
  })

  //DELETE
  it('should delete category with given ID', () => {
    categoryS.deleteCategory(1).subscribe(category => {
      expect(category.name).toBe('Category1')
    })

    const req = httpMock.expectOne(REST_API_ID);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.has('x-auth-token')).toBeTrue();

    req.flush(mockValueCategory);
  })

});
