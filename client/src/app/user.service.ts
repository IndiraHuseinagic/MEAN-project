import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Node/Express API
  REST_API: string = environment.baseUrl + '/users';
  
  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  register(user: any): Observable<any> {
    const body = JSON.stringify(user);
    return this.httpClient.post(this.REST_API, body, { headers: this.httpHeaders });
  };

  // Get user
  getUser() {
     let token = localStorage.getItem('token') || "";
    
    //me
    if (token) {
      let headers = this.httpHeaders.set('x-auth-token', token);
      return this.httpClient.get(`${this.REST_API}/me`, { headers: headers });
    }
    //empty user
    return of({});
  }

}
