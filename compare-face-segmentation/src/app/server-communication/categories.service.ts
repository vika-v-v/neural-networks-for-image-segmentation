import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Image {
  img_id: number;
  img_url: string;
  img_origin: string;
  // Add other image properties if any
}

export interface Undercategory {
  id: number;
  name: string;
  images: Image[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  deleteCategory(undercategoryId: number): Observable<any> {
    const url = 'http://localhost:3000/categories/' + undercategoryId;
    return this.http.delete<any>(url);
  }

  getCategories() {
    return this.http.get('http://localhost:3000/categories');
  }

  addCategory(category: { categ_name: string; order_in_list: number; undercategories: { name: string; order_in_list: number; }[] }): Observable<any> {
    const url = 'http://localhost:3000/categories/add-category';
    return this.http.post<any>(url, category);
  }

  editCategory(categoryId: number, category: { categ_name: string; order_in_list: number; undercategories: { id?: number; name: string; order_in_list: number; }[] }): Observable<any> {
    const url = 'http://localhost:3000/categories/' + categoryId;
    return this.http.put<any>(url, category);
  }

  getUndercategory(undercategoryId: number): Observable<{ undercategory: Undercategory }> {
    const url = `${this.baseUrl}/undercategories/${undercategoryId}`;
    return this.http.get<{ undercategory: Undercategory }>(url);
  }
}
