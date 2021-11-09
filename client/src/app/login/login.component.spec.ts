import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authS: AuthService; 
  let router: Router;
  let route: ActivatedRoute;

  let mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  }

  let mockActivatedRoute = {
    snapshot: {
      queryParamMap: convertToParamMap({
        returnUrl: 'my/profile'
      })
    }
  };

  const mockValueUser = {
    _id: '1',
    name: 'user1',
    email: 'user1@gmail.com',
    phone: '12345',
    isAdmin: true
  };  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [ 
        AuthService,
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute }
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authS =  TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert message for successful login', () => {
    authS.login = jasmine.createSpy().and.returnValue(of(mockValueUser));
    window.alert = jasmine.createSpy();
    fixture.detectChanges();

    component.login();

    expect(window.alert).toHaveBeenCalledWith("Log in successful!");
  });

  it('should navigate to returnUrl after successful login', () => {
    authS.login = jasmine.createSpy().and.returnValue(of(mockValueUser));
    let returnUrl = route.snapshot.queryParamMap.get('returnUrl') || '/';
    fixture.detectChanges();

    component.login();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(returnUrl);
  }); 

  it('should throw error message if login fails', () => {
    const error =  'username/password is not valid';
    authS.login = jasmine.createSpy().and.returnValue(throwError(error));
    fixture.detectChanges();

    component.login();

    expect(component.errorMessage).toBe(error);
  });

  it('it sould render error message if login fails', () => {
    component.errorMessage = 'username/password is not valid';
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.alert-warning'));
    
    expect(de.nativeElement.innerText).toContain('username/password is not valid');
  });

});


