import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  deleteCategory(undercategoryId: number): Observable<any> {
    const url = 'http://localhost:3000/categories/' + undercategoryId;
    return this.http.delete<any>(url);
  }

  getCategories() {
    return this.http.get('http://localhost:3000/categories');
  }
}
