import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

describe('UserService', () => {
  let userS: UserService;
  let httpMock: HttpTestingController;
  let store: any = {};

  let REST_API: string = environment.baseUrl + '/users';
  let REST_API_me = environment.baseUrl + '/users/me';

  const mockValueUser = { _id: 1, name: 'User1' };

  const mockLocalStorage = {
    getItem: (key: string) => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    userS = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(userS).toBeTruthy();
  });

  //GET with token
  it('should get user if token is provided', () => {
    localStorage.setItem = jasmine.createSpy().and.callFake(mockLocalStorage.setItem);
    mockLocalStorage.setItem('token', '12345678910');
    localStorage.getItem = jasmine.createSpy().and.callFake(mockLocalStorage.getItem);

    userS.getUser().subscribe(user =>
      expect(user).toBe(mockValueUser)
    )

    const req = httpMock.expectOne(REST_API_me);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')
    expect(req.request.headers.get('x-auth-token')).toBe('12345678910');

    req.flush(mockValueUser);
  })

  //GET no token
  it('should return empty object if token is not provided', () => {
    localStorage.setItem = jasmine.createSpy().and.callFake(mockLocalStorage.setItem);
    mockLocalStorage.setItem('token', '');
    localStorage.getItem = jasmine.createSpy().and.callFake(mockLocalStorage.getItem);

    userS.getUser().subscribe(user =>
      expect(user).toEqual({})
    );
  })

  //POST
  it('should register user', () => {
    userS.register({ name: 'User1' }).subscribe(user =>
      expect(user.name).toBe('User1'))

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')

    req.flush(mockValueUser);
  })

});
