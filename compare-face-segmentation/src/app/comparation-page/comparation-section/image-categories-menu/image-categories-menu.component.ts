import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../../../server-communication/image.service';
import { CommonModule } from '@angular/common';
import { PopupController } from '../../../popups/popup-controller.service';
import { CategoryService } from '../../../server-communication/categories.service';
import { CategoriesObserver, CategoriesObserverService } from './categories-observer.service';

@Component({
  selector: 'app-image-categories-menu',
  templateUrl: './image-categories-menu.component.html',
  styleUrls: ['./image-categories-menu.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ImageCategoriesMenuComponent implements CategoriesObserver {
  categories: any = [];
  activeCategoryIds: any[] = ["1"]; // Store active category IDs

  selectedUndercategoryId: number = 1; // Store selected undercategory ID as number

  @Output() undercategorySelected: EventEmitter<number> = new EventEmitter(); // Emit number ID

  constructor(private categoryService: CategoryService, private popupController: PopupController, private categoryObserverService: CategoriesObserverService) {
    this.updateCategories();

    console.log(this.activeCategoryIds);

    this.undercategorySelected.emit(this.selectedUndercategoryId);
    categoryObserverService.addCategoriesObserver(this);
    this.selectFirstUndercategory();
  }

  updateCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  showDeleteCategoryPopup(category: any) {
    this.popupController.showDeleteCategoryPopup(category);
  }

  toggleActiveCategory(categoryId: number) { // Use ID for comparison
    const index = this.activeCategoryIds.indexOf(categoryId);
    if (index > -1) {
      this.activeCategoryIds.splice(index, 1); // Remove ID if present
    } else {
      this.activeCategoryIds.push(categoryId); // Add ID if not present
    }
  }

  isActiveCategory(categoryId: number): boolean { // Check active status by ID
    return this.activeCategoryIds.includes(categoryId);
  }

  setSelectedUndercategory(undercategoryId: number) { // Use ID for setting
    this.selectedUndercategoryId = undercategoryId;
    this.undercategorySelected.emit(undercategoryId);
  }

  isSelectedUndercategory(undercategoryId: number): boolean { // Check selected status by ID
    return this.selectedUndercategoryId === undercategoryId;
  }

  triggerAddImagePopup() {
    this.popupController.showAddImagePopup();
  }

  triggerAddCategoryPopup() {
    this.popupController.showAddOrEditCategoryPopup();
  }

  triggerEditCategoryPopup(category: any) {
    this.popupController.showAddOrEditCategoryPopup(category);
  }

  selectFirstUndercategory() {
    if (this.categories.length > 0) {
      this.setSelectedUndercategory(this.categories[0].undercategories[0].id);
    }
    else {
      this.categoryService.getCategories().subscribe({
        next: (response: any) => {
          for (const category of this.categories) {
            if (category.undercategories && category.undercategories.length > 0) {
              this.selectedUndercategoryId = category.undercategories[0].id;
              this.undercategorySelected.emit(this.selectedUndercategoryId);
              this.toggleActiveCategory(category.id);
              break; // Exit the loop after selecting the first undercategory
            }
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    }
  }

  showImagesPopup(category: number) {
    this.popupController.showChangeUndercategoryImagesPopup(category);
  }
  
}
