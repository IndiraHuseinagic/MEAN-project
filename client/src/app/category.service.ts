import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from './models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // Node/Express API
  REST_API: string = environment.baseUrl + '/categories';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }

  // Add
  addCategory(category: any): Observable<any> {
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.post(this.REST_API, category, { headers: headers });
  }

  // Get all objects
  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.REST_API);
  }

  // Get single object
  getCategory(id: any): Observable<Category> {
    let API_URL = `${this.REST_API}/${id}`;
    return this.httpClient.get<Category>(API_URL);
  }

  // Update
  updateCategory(id: any, data: any): Observable<any> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.put(API_URL, data, { headers: headers });
  }

  // Delete
  deleteCategory(id: any): Observable<any> {
    let API_URL = `${this.REST_API}/${id}`;
    let token = localStorage.getItem('token') || "";
    let headers = this.httpHeaders.set('x-auth-token', token);
    return this.httpClient.delete(API_URL, { headers: headers });
  }

}
