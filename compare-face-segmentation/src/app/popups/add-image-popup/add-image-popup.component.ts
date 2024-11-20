import { Component } from '@angular/core';
import { PopupController, AddImagePopupObserver } from '../popup-controller.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../server-communication/categories.service';
import { FormsModule } from '@angular/forms';

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
export class AddImagePopupComponent implements AddImagePopupObserver {
  popupVisible: boolean = true;
  imageLoaded: boolean = false;
  shownSection: 'upload-image' | 'add-categories' | 'add-further-information' = 'add-further-information';

  imageUrl: string = '';
  allCategories: { id: number; name: string; undercategories: { id: number; name: string }[] }[] = [];
  filteredCategories: { id: number; name: string; undercategories: { id: number; name: string }[] }[] = [];
  selectedUndercategories: { id: number; name: string }[] = [];
  searchQuery: string = '';

  constructor(private popupController: PopupController, private categoryService: CategoryService) {
    this.popupController.addAddImagePopupObserver(this);
    this.loadCategories();
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
  
}
