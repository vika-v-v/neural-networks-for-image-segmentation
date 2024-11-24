import { Injectable } from '@angular/core';

export interface DeletePopupObserver {
    showDeleteCategoryPopup(category: any): void;
    // later add show image delete popup
}

export interface AddEditImagePopupObserver {
    showAddImagePopup(): void;
    showEditImagePopup(imageId: number): void;
}

export interface AddEditCategoryPopupObserver {
    showAddCategoryPopup(): void;
    showEditCategoryPopup(category: any): void;
}

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class PopupController {

    deletePopupObserver!: DeletePopupObserver;
    addImagePopupObserver!: AddEditImagePopupObserver;
    addCategoryPopupObserver!: AddEditCategoryPopupObserver;

    addDeletePopupObserver(observer: DeletePopupObserver): void {
        this.deletePopupObserver = observer;
    }

    showDeleteCategoryPopup(category: any): void {
        this.deletePopupObserver.showDeleteCategoryPopup(category);
    }

    addAddImagePopupObserver(observer: AddEditImagePopupObserver): void {
        this.addImagePopupObserver = observer;
    }

    showAddImagePopup(): void {
        this.addImagePopupObserver.showAddImagePopup();
    }

    showEditImagePopup(imageId: number): void {
        this.addImagePopupObserver.showEditImagePopup(imageId);
    }

    addAddCategoryPopupObserver(observer: AddEditCategoryPopupObserver): void {
        this.addCategoryPopupObserver = observer;
    }

    showAddOrEditCategoryPopup(category?: any): void {
        if(!category) this.addCategoryPopupObserver.showAddCategoryPopup();
        else          this.addCategoryPopupObserver.showEditCategoryPopup(category);
    }
}