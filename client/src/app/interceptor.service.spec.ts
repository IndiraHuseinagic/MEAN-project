import { throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InterceptorService } from './interceptor.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('InterceptorService', () => {
  let interceptor: InterceptorService;
  let httpMock: HttpTestingController;

  let httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['']);
  let httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterceptorService]
    });
    interceptor = TestBed.inject(InterceptorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should throw client side error', () => {

    //Client error
    const errorResponse = new HttpErrorResponse(
      { error: new ErrorEvent('Test', { message: 'network-error' }) });

    httpHandlerSpy.handle.and.returnValue(throwError(errorResponse));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      data => console.log('no-errors', data),
      err => expect(err).toEqual('network-error'))
  });

  it('should throw server side error', () => {

    //server error
    const errorResponse = new HttpErrorResponse(
      {
        status: 404,
        statusText: 'Not found',
        url: 'https://dummy-url',
        error: { message: 'not-found-error' }
      });

    httpHandlerSpy.handle.and.returnValue(throwError(errorResponse));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      data => console.log('no-error', data),
      err => expect(err.message).toEqual('not-found-error'))
  });

});


