import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from '../user.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userS: UserService;

  const mockValueUser  = {
    _id: '1',
    name: 'user1',
    email: 'user1@gmail.com',
    phone: '12345',
    isAdmin: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ UserService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userS =  TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return user for given token', () => {
    userS.getUser = jasmine.createSpy().and.returnValue(of(mockValueUser));
    fixture.detectChanges();

    component.user$.subscribe(u => 
      expect(u).toEqual(mockValueUser));
  });

});
