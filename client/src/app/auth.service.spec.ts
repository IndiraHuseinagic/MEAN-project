import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authS: AuthService;
  let httpMock: HttpTestingController;

  let REST_API: string = environment.baseUrl + '/auth';
  let store: any = {};

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
    localStorage.setItem = jasmine.createSpy().and.callFake(mockLocalStorage.setItem);
    mockLocalStorage.setItem('user', JSON.stringify(mockValueUser));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    authS = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    store = {}
  })

  it('should be created', () => {
    expect(authS).toBeTruthy();
  });

  //POST
  it('should log user', () => {

    authS.login({ name: 'User1' }).subscribe(user => {
      expect(user).toEqual(mockValueUser)
      expect(authS.userSubject.value).toEqual(user)
      expect(authS.userValue).toEqual(user)
    })

    const req = httpMock.expectOne(REST_API);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json')

    req.flush(mockValueUser);
  })

  it('should logout user', () => {

    localStorage.removeItem = jasmine.createSpy().and.callFake(mockLocalStorage.removeItem);

    authS.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(authS.userSubject.value).toBe(null);
    expect(authS.userValue).toBe(null);
  })
});
