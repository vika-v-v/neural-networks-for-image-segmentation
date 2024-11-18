import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { deletePopupObserver } from '../popup-controller.class';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css'
})
export class DeletePopupComponent implements deletePopupObserver {
  category: any;
  popupVisible: boolean = true;

  showDeleteCategoryPopup(category: any): void {
    this.category = category;
    this.popupVisible = true;
  }
}
