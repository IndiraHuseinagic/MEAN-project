import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apartment } from './models/apartment';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  // Node/Express API
REST_API: string = 'http://localhost:3000/api/apartments';

// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
headers = this.httpHeaders.set('x-auth-token', localStorage.getItem('token') || "");

constructor(private httpClient: HttpClient) { }

// Add
addApartment(data: any): Observable<any> {
  let API_URL = `${this.REST_API}`; 
  return this.httpClient.post(API_URL, data, { headers: this.headers });
}

// Get all objects
getAllApartments(): Observable<Apartment[]> {
  return this.httpClient.get<Apartment[]>(`${this.REST_API}`);
}

// Get single object
getApartment(id:any): Observable<Apartment> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.get<Apartment>(API_URL);
}

// Update
updateApartment(id:any, data:any): Observable<Apartment> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.put<Apartment>(API_URL, data, { headers: this.headers });
}

// Delete
deleteApartment(id:any): Observable<Apartment> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.delete<Apartment>(API_URL, { headers: this.headers});
}

}
