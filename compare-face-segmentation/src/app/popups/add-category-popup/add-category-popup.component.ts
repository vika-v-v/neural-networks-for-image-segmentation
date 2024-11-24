import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { PopupController, AddEditCategoryPopupObserver } from '../popup-controller.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../server-communication/categories.service';
import { CategoriesObserverService } from '../../comparation-page/comparation-section/image-categories-menu/categories-observer.service';

@Component({
  selector: 'app-add-category-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './add-category-popup.component.html',
  styleUrl: './add-category-popup.component.css'
})
export class AddCategoryPopupComponent implements AddEditCategoryPopupObserver {
  // TODO: after a lot of times adding and removing the undercategories, there is some problem with the server, fix it
  popupVisible: boolean = false;
  undercategories: {id?: number, name: string, currentlyEditing: boolean}[] = [];
  categoryName: string = '';
  editingMode: boolean = false;
  categoryId: number = -1;

  constructor(private popupController: PopupController, private categoryService: CategoryService, private categoryObserverService: CategoriesObserverService) {
    this.popupController.addAddCategoryPopupObserver(this);
  }

  showAddCategoryPopup(): void {
    this.popupVisible = true;
    this.editingMode = false;
  }

  // In AddCategoryPopupComponent
  showEditCategoryPopup(category: any): void {
    this.categoryName = category.name;
    this.undercategories = category.undercategories.map((uc: any) => ({
      id: uc.id, // Include the undercategory ID
      name: uc.name,
      currentlyEditing: false
    }));
    this.categoryId = category.id;

    this.editingMode = true;
    this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }

  addUndercategory(): void {
    this.undercategories.push({name: 'New Undercategory', currentlyEditing: true });
  }  

  editUndercategory(undercateg: { name: string; currentlyEditing: boolean }): void {
    undercateg.currentlyEditing = true;
  }

  saveUndercategory(undercateg: { name: string; currentlyEditing: boolean }): void {
    undercateg.currentlyEditing = false;
  }

  removeUndercategory(undercateg: { name: string; currentlyEditing: boolean }): void {
    this.undercategories = this.undercategories.filter(item => item !== undercateg);
  }

  onDrop(event: any): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const movedItem = this.undercategories.splice(previousIndex, 1)[0];
    this.undercategories.splice(currentIndex, 0, movedItem);
  }

  addOrEditCategory(): void {
    // Prepare the category object
    console.log('Adding category:', this.categoryName, this.undercategories);
    const category = {
      categ_name: this.categoryName,
      order_in_list: 1, // Set a default order or use a dynamic value
      undercategories: this.undercategories.map((uc, index) => ({
        id: uc.id,
        name: uc.name,
        order_in_list: index + 1
      }))
    };

    // TODO: fix removing undercategories and adding them once again becuase the images are lost
    // Call the service method
    if(!this.editingMode) {
      this.categoryService.addCategory(category).subscribe(
        response => {
          console.log('Category added successfully:', response);
          this.hidePopup(); // Hide the popup on success
          this.categoryObserverService.updateCategories();
        },
        error => {
          console.error('Error adding category:', error);
          // TODO: add a popup
        }
      );
    }
    else  {
      this.categoryService.editCategory(this.categoryId, category).subscribe(
        response => {
          console.log('Category edited successfully:', response);
          this.hidePopup(); // Hide the popup on success
          this.categoryObserverService.updateCategories();
        },
        error => {
          console.error('Error editing category:', error);
          // TODO: add a popup
        }
      );
    }

    // Reset the form fields
    this.categoryName = '';
    this.undercategories = [];

    this.hidePopup();
  }
}
