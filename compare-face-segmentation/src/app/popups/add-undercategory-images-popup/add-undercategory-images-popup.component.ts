import { Component } from '@angular/core';
import { ChangeUndercategoryImagesPopupObserver, PopupController } from '../popup-controller.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-undercategory-images-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './add-undercategory-images-popup.component.html',
  styleUrl: './add-undercategory-images-popup.component.css'
})
export class AddUndercategoryImagesPopupComponent implements ChangeUndercategoryImagesPopupObserver {

  popupVisible: boolean = true;

  constructor(private popupController: PopupController) {
    this.popupController.addChangeUndercategoryImagesPopupObserver(this);
  }

  showChangeUndercategoryImagesPopup(undercategoryId: number): void {
      this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }
}
