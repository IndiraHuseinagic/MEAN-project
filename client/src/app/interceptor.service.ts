import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          let warning = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Client: Error: ${error.error.message}`;
            warning = error.error.message;

          } else {
            // server-side error
            errorMessage = `Server: Error Status: ${error.status}\nMessage: ${error.message}`;
            warning = error.error;
          }
          console.log(errorMessage);
          return throwError(warning);
        })
      );
  }
}


