import { Injectable } from '@angular/core';

export interface CategoriesObserver {
    updateCategories(): void;
}

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class CategoriesObserverService {
  categoriesObservers: CategoriesObserver[] = [];

  addCategoriesObserver(observer: CategoriesObserver): void {
    this.categoriesObservers.push(observer);
  }

  updateCategories(): void {
    this.categoriesObservers.forEach(observer => observer.updateCategories());
  }
}