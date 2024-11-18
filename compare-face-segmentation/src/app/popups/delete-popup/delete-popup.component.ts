import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PopupController, deletePopupObserver } from '../popup-controller.service';
import { CategoryService } from '../../server-communication/categories.service';
import { CategoriesObserverService } from '../../comparation-page/comparation-section/image-categories-menu/categories-observer.service';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css'
})
export class DeletePopupComponent implements deletePopupObserver  {
  category: any = {name: '', id: 0};
  popupVisible: boolean = false;

  constructor(private popupController: PopupController, private categoryService: CategoryService, private categoryObserverService: CategoriesObserverService) {
    this.popupController.addDeletePopupObserver(this);
  }

  showDeleteCategoryPopup(category: any): void {
    this.category = category;
    this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }

  deleteCategory(): void {
    this.popupVisible = false;
    this.categoryService.deleteCategory(this.category.id).subscribe({
      next: (response: any) => {
        // TODO: show success message
        this.categoryObserverService.updateCategories();
      },
      error: (error) => {
        console.error('Error deleting categories:', error);
        this.categoryObserverService.updateCategories();
      }
    });
  }
}
