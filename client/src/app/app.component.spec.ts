import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {

  class StubComponent { }
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ RouterTestingModule.withRoutes([
        { path: '', component: StubComponent }]) 
      ],
      providers: [ 
        { provide: LocationStrategy, useClass: MockLocationStrategy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'modern-home'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('modern-home');
  });

});
