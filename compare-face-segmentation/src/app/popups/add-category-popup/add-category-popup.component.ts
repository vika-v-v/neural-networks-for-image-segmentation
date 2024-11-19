import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopupController, addCategoryPopupObserver } from '../popup-controller.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

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
export class AddCategoryPopupComponent implements addCategoryPopupObserver {
  popupVisible: boolean = true;
  undercategories: {name: string, currentlyEditing: boolean}[] = [];

  constructor(private popupController: PopupController) {
    this.popupController.addAddCategoryPopupObserver(this);
    this.undercategories.push({name: 'Test', currentlyEditing: false});
    this.undercategories.push({name: 'Test 2', currentlyEditing: false});
    this.undercategories.push({name: 'Test 3', currentlyEditing: false});
    this.undercategories.push({name: 'Test 4', currentlyEditing: false});
  }

  showAddCategoryPopup(): void {
    this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }

  addUndercategory(): void {
    this.undercategories.push({ name: 'New Undercategory', currentlyEditing: true });
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
}
