import { Reservation } from './models/reservation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private httpClient: HttpClient) { }

  // Node/Express API
  REST_API: string = environment.baseUrl + '/reservations';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  // Add
  addReservation(reservation: any): Observable<any> {
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.post(this.REST_API, reservation, { headers: headers });
  }

  // Get all objects
  getAllReservations(): Observable<Reservation[]> {
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.get<Reservation[]>(this.REST_API, { headers: headers });
  }

  // Get single object
  getReservation(id: any): Observable<Reservation> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.get<Reservation>(API_URL, { headers: headers });
  }

  //get reservation by user
  getReservationsByUser(): Observable<Reservation[]> {
    let API_URL = `${this.REST_API}/my`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.get<Reservation[]>(API_URL, { headers: headers });
  }

  // Delete
  deleteReservation(id: any): Observable<any> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.delete(API_URL, { headers: headers });
  }

}
