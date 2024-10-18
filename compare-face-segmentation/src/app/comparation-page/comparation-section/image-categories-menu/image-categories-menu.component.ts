import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../../../server-communication/image.service';

@Component({
  selector: 'app-image-categories-menu',
  templateUrl: './image-categories-menu.component.html',
  styleUrls: ['./image-categories-menu.component.css'] // Corrected styleUrl to styleUrls
})
export class ImageCategoriesMenuComponent {
  categories: any = [];
  activeCategoryIds: any[] = ["1"]; // Store active category IDs

  selectedUndercategoryId: number = 1; // Store selected undercategory ID as number

  @Output() undercategorySelected: EventEmitter<number> = new EventEmitter(); // Emit number ID

  constructor(private imageService: ImageService) {
    this.imageService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });

    console.log(this.activeCategoryIds);

    this.undercategorySelected.emit(this.selectedUndercategoryId);
  }

  toggleActiveCategory(categoryId: number) { // Use ID for comparison
    const index = this.activeCategoryIds.indexOf(categoryId);
    if (index > -1) {
      this.activeCategoryIds.splice(index, 1); // Remove ID if present
    } else {
      this.activeCategoryIds.push(categoryId); // Add ID if not present
    }
  }

  isActiveCategory(categoryId: number): boolean { // Check active status by ID
    return this.activeCategoryIds.includes(categoryId);
  }

  setSelectedUndercategory(undercategoryId: number) { // Use ID for setting
    this.selectedUndercategoryId = undercategoryId;
    this.undercategorySelected.emit(undercategoryId);
  }

  isSelectedUndercategory(undercategoryId: number): boolean { // Check selected status by ID
    return this.selectedUndercategoryId === undercategoryId;
  }
}
