import { Reservation } from './models/reservation';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  // Node/Express API
//REST_API: string = 'http://localhost:3000/api/reservations';
REST_API: string ='https://modern-home.herokuapp.com/api/reservations'

// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
headers = this.httpHeaders.set('x-auth-token', localStorage.getItem('token') || "");

constructor(private httpClient: HttpClient) { }

// Add
addReservation(reservation: any): Observable<any> {
  let API_URL = `${this.REST_API}`; //`${this.REST_API}/add-category`;
  return this.httpClient.post(API_URL, reservation, { headers: this.headers });
}

// Get all objects
getAllReservations(): Observable<Reservation []>  {
  return this.httpClient.get<Reservation []>(`${this.REST_API}`, { headers: this.headers });
}

// Get single object
getReservation(id:any): Observable<Reservation> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.get<Reservation>(API_URL, { headers: this.headers });
}

//get reservation by user
getReservationsByUser(): Observable<Reservation[]> {
  let API_URL = `${this.REST_API}/my`;
   return this.httpClient.get<Reservation []>(API_URL, { headers: this.headers});
}



// Delete
deleteReservation(id:any): Observable<Reservation> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.delete<Reservation>(API_URL, { headers: this.headers});
}

}
