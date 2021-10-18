import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Category } from './models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

// Node/Express API
REST_API: string = 'http://localhost:3000/api/categories';

// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
headers = this.httpHeaders.set('x-auth-token', localStorage.getItem('token') || "");

constructor(private httpClient: HttpClient) { }

// Add
addCategory(category: any): Observable<Category> {
  let API_URL = `${this.REST_API}`; //`${this.REST_API}/add-category`;
  return this.httpClient.post<Category>(API_URL, category, { headers: this.headers });
}

// Get all objects
getAllCategories(): Observable<Category []> {
  return this.httpClient.get<Category []>(`${this.REST_API}`);
}

// Get single object
getCategory(id:any): Observable<Category> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.get<Category>(API_URL);
}

// Update
updateCategory(id:any, data:any): Observable<any> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.put(API_URL, data, { headers: this.headers });
}

// Delete
deleteCategory(id:any): Observable<any> {
  let API_URL = `${this.REST_API}/${id}`;
  return this.httpClient.delete(API_URL, { headers: this.headers});
}

}
