import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Node/Express API
//REST_API: string = 'http://localhost:3000/api/auth';
REST_API: string ='https://modern-home.herokuapp.com/api/auth'
// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  login(user: any) {
    let returnUrl=this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    const body = JSON.stringify(user);
    let API_URL = `${this.REST_API}`; 
    return this.httpClient.post(API_URL, body, { headers: this.httpHeaders, responseType: 'text' });
  };

  logout(){
   localStorage.removeItem('token'); 
  }
  
  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
  

}
