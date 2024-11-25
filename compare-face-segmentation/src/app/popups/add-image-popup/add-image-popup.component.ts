import { Component } from '@angular/core';
import { PopupController, AddEditImagePopupObserver } from '../popup-controller.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../server-communication/categories.service';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../server-communication/image.service';
import { ImageObserverService } from './image-observer.service';

@Component({
  selector: 'app-add-image-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-image-popup.component.html',
  styleUrl: './add-image-popup.component.css'
})
export class AddImagePopupComponent implements AddEditImagePopupObserver {
  // TODO: add the possibility to remove the added image
  // TODO: save origin, tags and notes
  popupVisible: boolean = false;
  imageLoaded: boolean = false;
  shownSection: 'upload-image' | 'add-categories' | 'add-further-information' = 'upload-image';

  imageUrl: string = '';
  allCategories: { id: number; name: string; undercategories: { id: number; name: string }[] }[] = [];
  filteredCategories: { id: number; name: string; undercategories: { id: number; name: string }[] }[] = [];
  selectedUndercategories: { id: number; name: string }[] = [];
  searchQuery: string = '';

  editingMode: boolean = false;
  imageId: number | null = null;
  originalImageUrl: string = '';

  constructor(private popupController: PopupController, private categoryService: CategoryService, private imageService: ImageService, private imageObserverService: ImageObserverService) {
    this.popupController.addAddImagePopupObserver(this);
    this.loadCategories();
  }

  showAddImagePopup(): void {
    this.editingMode = false;
    this.popupVisible = true;
    this.loadCategories();
  }

  // TODO: make this better: add origin, tags, notes
  showEditImagePopup(imageId: number): void {
    this.imageService.getImage(imageId).subscribe(
      (imageData) => {
        this.imageId = imageId;
        this.editingMode = true;
  
        // Set the image URL for preview
        this.imageUrl = imageData.image.img_url;
        this.originalImageUrl = imageData.image.img_url; // Store the original URL
        this.imageLoaded = true;
  
        // Set the selected undercategories
        this.selectedUndercategories = imageData.undercategories.map((uc: any) => {
          const categoryName = uc.categ_name;
          return {
            id: uc.ucateg_id,
            name: `${categoryName}.${uc.ucateg_name}`
          };
        });
  
        // Set other properties if applicable (e.g., origin, tags, notes)
        // this.origin = imageData.image.img_origin;
  
        this.popupVisible = true;
        this.shownSection = 'add-categories';
  
        // Load categories if necessary
        if (!this.allCategories || this.allCategories.length === 0) {
          this.loadCategories();
        }
  
        this.filteredCategories = [...this.allCategories];
      },
      (error) => {
        console.error('Error fetching image data for editing:', error);
      }
    );
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
    this.imageService.getRandomImageBase64().subscribe(
      (base64String: string) => {
        this.imageUrl = base64String;
        this.imageLoaded = true;
      },
      (error) => {
        console.error('Error fetching random image as Base64:', error);
      }
    );
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((response: any) => {
      this.allCategories = response.categories;
      this.filteredCategories = [...this.allCategories]; // Initialize filtered categories
    });
  }

  // Filter categories based on search query
  onSearch(query: string): void {
    this.searchQuery = query;
    if (query.trim() === '') {
      this.filteredCategories = [...this.allCategories];
    } else {
      this.filteredCategories = this.allCategories.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.undercategories.some(uc => uc.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }

  // Select an undercategory
  selectUndercategory(categoryName: string, undercategory: { id: number; name: string }): void {
    if (!this.selectedUndercategories.some(uc => uc.id === undercategory.id)) {
      this.selectedUndercategories.push({
        id: undercategory.id,
        name: `${categoryName}.${undercategory.name}` // Format as category.undercategory
      });
    }
  }  

  // Remove an undercategory from selected list
  removeUndercategory(undercategory: { id: number; name: string }): void {
    this.selectedUndercategories = this.selectedUndercategories.filter(uc => uc.id !== undercategory.id);
  }  

  isUndercategorySelected(undercategory: { id: number; name: string }): boolean {
    return this.selectedUndercategories.some(uc => uc.id === undercategory.id);
  }

  cancel(): void {
    this.hidePopup();
    this.imageUrl = '';
    this.imageLoaded = false;
    this.filteredCategories = this.allCategories;
    this.selectedUndercategories = [];
    this.searchQuery = '';
    this.shownSection = 'upload-image';
    this.editingMode = false;
    this.imageId = null;
  }

  saveImage(): void {
    if (!this.imageUrl) {
      console.error('No image URL provided.');
      return;
    }
  
    if (this.selectedUndercategories.length === 0) {
      console.error('No undercategories selected.');
    }
  
    const image = {
      url: this.imageUrl,
      undercategories: this.selectedUndercategories.map(uc => uc.id) // Send only the IDs of selected undercategories
    };

    
    if (this.editingMode && this.imageId !== null) {
      // Update existing image
      
        this.imageService.updateAndProcessImage(this.imageId, image).subscribe(
          (response) => {
            console.log('Image updated successfully:', response);
            this.imageObserverService.imagesUpdated();
            this.cancel(); // Reset the popup
          },
          (error) => {
            console.error('Error updating image:', error);
          }
        );
      
    } else {
      // Save new image
      this.imageService.saveAndProcessImage(image).subscribe(
        (response) => {
          console.log('Image saved successfully:', response);
          this.imageObserverService.imageAdded(response.imgId);
          this.cancel(); // Reset the popup
        },
        (error) => {
          console.error('Error saving image:', error);
        }
      );}
  }
}
