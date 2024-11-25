import { Component } from '@angular/core';
import { ChangeUndercategoryImagesPopupObserver, PopupController } from '../popup-controller.service';
import { CommonModule } from '@angular/common';
import { CategoryService, Image } from '../../server-communication/categories.service';
import { ImageService } from '../../server-communication/image.service';
import { ImageObserverService } from '../add-image-popup/image-observer.service';

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

  popupVisible: boolean = false;
  undercategoryId: number | null = null;
  undercategoryName: string = '';
  undercategoryImages: Image[] = []; // Images currently in the undercategory
  allImages: Image[] = []; // All images
  selectedImages: { [key: number]: boolean } = {}; 

  constructor(private popupController: PopupController, private categoryService: CategoryService, private imageService: ImageService, private imageObserverService: ImageObserverService) {
    this.popupController.addChangeUndercategoryImagesPopupObserver(this);
  }

  showChangeUndercategoryImagesPopup(undercategoryId: number): void {
    this.popupVisible = true;
    this.undercategoryId = undercategoryId;

    // Fetch the undercategory and its images
    this.categoryService.getUndercategory(undercategoryId).subscribe(
      (response) => {
        const undercategory = response.undercategory;
        this.undercategoryName = undercategory.name;
        this.undercategoryImages = undercategory.images;

        // Initialize selectedImages with images in the undercategory
        this.selectedImages = {};
        undercategory.images.forEach(img => {
          this.selectedImages[img.img_id] = true;
        });

        // Fetch all images to display
        this.imageService.getAllImages().subscribe(
          (allImagesResponse) => {
            this.allImages = allImagesResponse.images;

            // Initialize selection state for all images
            this.allImages.forEach(img => {
              if (!(img.img_id in this.selectedImages)) {
                this.selectedImages[img.img_id] = false;
              }
            });
          },
          (error) => {
            console.error('Error fetching all images:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching undercategory:', error);
      }
    );
  }

  hidePopup(): void {
    this.popupVisible = false;
    this.undercategoryId = null;
    this.undercategoryName = '';
    this.undercategoryImages = [];
    this.allImages = [];
    this.selectedImages = {};
  }

  save(): void {
    if (this.undercategoryId === null) {
      console.error('Undercategory ID is null');
      return;
    }

    // Get the list of selected image IDs
    const selectedImageIds = Object.keys(this.selectedImages)
      .filter(imgId => this.selectedImages[parseInt(imgId, 10)])
      .map(imgId => parseInt(imgId, 10));

    // Update the images associated with the undercategory
    this.categoryService.updateUndercategoryImages(this.undercategoryId, selectedImageIds).subscribe(
      (response) => {
        console.log('Undercategory images updated successfully:', response);
        this.imageObserverService.imagesUpdated();
        this.hidePopup();
      },
      (error) => {
        console.error('Error updating undercategory images:', error);
      }
    );
  }

  toggleImageSelection(imgId: number): void {
    this.selectedImages[imgId] = !this.selectedImages[imgId];
  }

  isImageSelected(imgId: number): boolean {
    return !!this.selectedImages[imgId];
  }
}
