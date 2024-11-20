import { Component } from '@angular/core';
import { PopupController, AddImagePopupObserver } from '../popup-controller.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-image-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './add-image-popup.component.html',
  styleUrl: './add-image-popup.component.css'
})
export class AddImagePopupComponent implements AddImagePopupObserver {
  popupVisible: boolean = false;
  imageLoaded: boolean = false;
  shownSection: 'upload-image' | 'add-categories' | 'add-further-information' = 'upload-image';

  constructor(private popupController: PopupController) {
    this.popupController.addAddImagePopupObserver(this);
  }

  showAddImagePopup(): void {
    this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }
}
