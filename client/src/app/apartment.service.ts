import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apartment } from './models/apartment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  // Node/Express API
  REST_API: string = environment.baseUrl + '/apartments';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  // Add
  addApartment(data: any): Observable<any> {
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.post(this.REST_API, data, { headers: headers });
  }

  // Get all objects
  getAllApartments(): Observable<Apartment[]> {
    return this.httpClient.get<Apartment[]>(this.REST_API);
  }

  // Get single object
  getApartment(id: any): Observable<Apartment> {
    let API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get<Apartment>(API_URL);
  }

  // Update
  updateApartment(id: any, data: any): Observable<any> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.put(API_URL, data, { headers: headers });
  }

  // Delete
  deleteApartment(id: any): Observable<any> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.delete(API_URL, { headers: headers });
  }

}
