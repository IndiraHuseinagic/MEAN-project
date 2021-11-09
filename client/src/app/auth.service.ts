import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject: BehaviorSubject<any>;
  public user$: Observable<any>;

  // Node/Express API
  REST_API: string = environment.baseUrl + '/auth';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || "{}"));
    this.user$ = this.userSubject.asObservable();
  }

  get userValue() {
    return this.userSubject.value;
  }

  login(user: any) {
    const body = JSON.stringify(user);
    return this.httpClient.post(this.REST_API, body, { headers: this.httpHeaders, responseType: 'text', observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => {
        //header
        const token = res.headers.get('x-auth-token') || "";
        localStorage.setItem('token', token);

        //body
        const user = JSON.parse(res.body);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

}
