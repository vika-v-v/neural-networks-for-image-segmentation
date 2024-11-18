import { Component } from '@angular/core';
import { PopupController } from '../popup-controller.service';

@Component({
  selector: 'app-add-image-popup',
  standalone: true,
  imports: [],
  templateUrl: './add-image-popup.component.html',
  styleUrl: './add-image-popup.component.css'
})
export class AddImagePopupComponent implements AddImagePopupComponent{
  popupVisible: boolean = false;

  constructor(private popupController: PopupController) {
    this.popupController.addAddImagePopupObserver(this);
  }

  showAddImagePopup(): void {
    this.popupVisible = true;
  }
}
