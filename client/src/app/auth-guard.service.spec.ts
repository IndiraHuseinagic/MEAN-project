import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth-guard.service';

describe('AuthGuardService', () => {
  let authGuard: AuthGuard;
  let router: Router;

  let mockUrl = 'https://dummy-url';

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  let mockValueToken = '12345678910';

  let store: any = {};

  const mockLocalStorage = {
    getItem: (key: string) => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
  };

  const mockRouterState = (url: string) => ({ url } as RouterStateSnapshot);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }]
    });
    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if user is logged in (token provided)', () => {
    //Loged in
    localStorage.setItem = jasmine.createSpy().and.callFake(mockLocalStorage.setItem);
    mockLocalStorage.setItem('token', mockValueToken);

    localStorage.getItem = jasmine.createSpy().and.callFake(mockLocalStorage.getItem);
    let canActivate = authGuard.canActivate(null, mockRouterState(mockUrl));

    expect(canActivate).toBeTrue();
  });

  it('should deny access if user is not logged in (no token provided)', () => {
    //Loged out
    localStorage.setItem = jasmine.createSpy().and.callFake(mockLocalStorage.setItem);
    mockLocalStorage.setItem('token', '');

    localStorage.getItem = jasmine.createSpy().and.callFake(mockLocalStorage.getItem);
    let canActivate = authGuard.canActivate(null, mockRouterState(mockUrl));

    expect(router.navigate).toHaveBeenCalledWith(['/login'],
      { queryParams: { returnUrl: mockRouterState(mockUrl).url } });

    expect(canActivate).toBeFalse();
  });

});
