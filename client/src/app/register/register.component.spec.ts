import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../user.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userS: UserService;
  let router: Router;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  const mockValueUser  = {
    _id: '1',
    name: 'user1',
    email: 'user1@gmail.com',
    phone: '12345',
    isAdmin: true
  };  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ HttpClientTestingModule, FormsModule ],
      providers: [ 
        UserService,
        {provide: Router, useValue: mockRouter} ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userS =  TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert message for successful registration', () => {
    userS.register = jasmine.createSpy().and.returnValue(of(mockValueUser));
    window.alert = jasmine.createSpy();
    fixture.detectChanges();

    component.register();

    expect(window.alert).toHaveBeenCalledWith("Registration successful");
  });

  it('should navigate to login page if user is successfully registered', () => { 
    userS.register = jasmine.createSpy().and.returnValue(of(mockValueUser));
    fixture.detectChanges();

    component.register();

    expect(router.navigate).toHaveBeenCalledWith (['/login']);
  });

  it('should throw error message if user can not be registered', () => {
    const error =  'user is already registered';
    userS.register = jasmine.createSpy().and.returnValue(throwError(error));

    component.register();

    expect(component.errorMessage).toBe(error);
  });

  it('it sould render error message if user can not be registered', () => {
    component.errorMessage = 'user is already registered';
    fixture.detectChanges();

    let de = fixture.debugElement.query(By.css('.alert-warning'));
    
    expect(de.nativeElement.innerText).toContain('user is already registered');
  });
  
});
