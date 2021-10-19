import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Node/Express API
//REST_API: string = 'http://localhost:3000/api/users';
REST_API: string ='https://modern-home.herokuapp.com/api/users'

// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(private httpClient: HttpClient) { }

  register(user: any) {
    const body = JSON.stringify(user);
    let API_URL = `${this.REST_API}`; 
    return this.httpClient.post(API_URL, body, { headers: this.httpHeaders });
  };

  // Get all users
  getAllUsers() {
    return this.httpClient.get(`${this.REST_API}`);
  }

  // Get user
  getUser() {
    let headers = this.httpHeaders.set('x-auth-token', localStorage.getItem('token') || "");
      return this.httpClient.get(`${this.REST_API}/me`, {headers:headers});
  }
  
}
