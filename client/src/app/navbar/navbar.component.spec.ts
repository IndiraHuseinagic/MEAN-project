import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let authS: jasmine.SpyObj<AuthService>;

  const mockValueUser = {
    _id: '1',
    name: 'user1',
    email: 'user1@gmail.com',
    phone: '12345',
    isAdmin: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [HttpClientTestingModule, FormsModule, NgbModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authS = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return user if he is logged in', () => {
    authS.user$ = of(mockValueUser);
    fixture.detectChanges();

    authS.user$.subscribe((u: any) => {
      expect(component.user).toEqual(u)
    });
  });

  it('should return true if user is logged in', () => {
    authS.user$ = of(mockValueUser);
    fixture.detectChanges();

    expect(component.isLogged).toBeTrue();
  });

  it('should call authS.logout method', () => {
    authS.logout = jasmine.createSpy();

    component.logout();

    expect(authS.logout).toHaveBeenCalled();
  });

  it('should navigate to home page after logout', () => {
    router.navigate = jasmine.createSpy();

    component.logout();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  //NAV-LINKS
  describe('navigation links', () => {

    it('should have a link to home page', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/");

      expect(index).toBeGreaterThan(-1);
    });

    it('should have a link to apartments page', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/apartments");

      expect(index).toBeGreaterThan(-1);
    });

    it('should have a link to login if user is not logged in', () => {
      authS.user$ = of({});
      fixture.detectChanges();

      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/login");

      expect(index).toBeGreaterThan(-1);
    });
  })

  describe('navigation links for logged user and admin', () => {

    beforeEach(() => {
      authS.user$ = of(mockValueUser);
      fixture.detectChanges();
    })

    it('should have a link to my/profile page if user is logged in', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/my/profile");

      expect(index).toBeGreaterThan(-1);
    });

    it('should have a link to my/reservations if user is logged in', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/my/reservations");

      expect(index).toBeGreaterThan(-1);
    });

    it('should have a link to admin/apartments if user is admin', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/admin/apartments");

      expect(index).toBeGreaterThan(-1);
    });

    it('should have a link to admin/reservations if user is admin', () => {
      let debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));

      let index = debugElements.findIndex(de =>
        de.nativeElement.attributes.getNamedItem('routerlink')?.value === "/admin/reservations");

      expect(index).toBeGreaterThan(-1);
    });
  })

});
