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
  popupVisible: boolean = true;
  imageLoaded: boolean = false;
  shownSection: 'upload-image' | 'add-categories' | 'add-further-information';

  imageUrl: string = '';

  constructor(private popupController: PopupController) {
    this.popupController.addAddImagePopupObserver(this);
    this.shownSection = 'add-categories';
  }

  showAddImagePopup(): void {
    this.popupVisible = true;
  }

  hidePopup(): void {
    this.popupVisible = false;
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result as string; // Set the image URL for preview
        this.imageLoaded = true;
      };

      reader.readAsDataURL(file); // Convert file to base64 string
    }
  }

  // Handle URL input
  onUrlInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input || !input.value) return; // Check for valid input element and value
    this.imageUrl = input.value.trim(); // Assign the trimmed value to the imageUrl property
    this.imageLoaded = true;
  }  

  generateRandomImage(): void {
    const randomImageUrl = `https://thispersondoesnotexist.com?${Date.now()}`;
    this.imageUrl = randomImageUrl;
    this.imageLoaded = true;
  }  

  nextSection(): void {
    if (this.shownSection === 'upload-image') {
      this.shownSection = 'add-categories';
    } else if (this.shownSection === 'add-categories') {
      this.shownSection = 'add-further-information';
    }
  }

  previousSection(): void {
    if (this.shownSection === 'add-categories') {
      this.shownSection = 'upload-image';
    } else if (this.shownSection === 'add-further-information') {
      this.shownSection = 'add-categories';
    }
  }
}
