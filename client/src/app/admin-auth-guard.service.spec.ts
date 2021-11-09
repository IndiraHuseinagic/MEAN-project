import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminAuthGuardService', () => {
  let adminGuard: AdminAuthGuard;
  let router: Router;
  let authS: AuthService;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }
  
  const mockValueUser = { 
     _id: 1,
     name: 'User1', 
     isAdmin: true };

  const mockAuthS = {
    get userValue() {
      return mockValueUser;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthS },
        { provide: Router, useValue: mockRouter }]
    });
    adminGuard = TestBed.inject(AdminAuthGuard);
    router = TestBed.inject(Router);
    authS = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(adminGuard).toBeTruthy();
  });

  it('should allow access if user is admin', () => {
    mockValueUser.isAdmin = true;

    let canActivate = adminGuard.canActivate();

    expect(canActivate).toBeTrue();
  });

  it('should deny access if user is not admin', () => {
    mockValueUser.isAdmin = false;

    let canActivate = adminGuard.canActivate();

    expect(canActivate).toBeFalse();
  });

});
