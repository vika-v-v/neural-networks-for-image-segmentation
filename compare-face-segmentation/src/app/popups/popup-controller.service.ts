import { Injectable } from '@angular/core';

export interface deletePopupObserver {
    showDeleteCategoryPopup(category: any): void;
    // later add show image delete popup
}

export interface addImagePopupObserver {
    showAddImagePopup(): void;
}

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class PopupController {

    deletePopupObserver!: deletePopupObserver;
    addImagePopupObserver!: addImagePopupObserver;

    addDeletePopupObserver(observer: deletePopupObserver): void {
        this.deletePopupObserver = observer;
    }

    showDeleteCategoryPopup(category: any): void {
        this.deletePopupObserver.showDeleteCategoryPopup(category);
    }

    addAddImagePopupObserver(observer: addImagePopupObserver): void {
        this.addImagePopupObserver = observer;
    }

    showAddImagePopup(): void {
        console.log('show add image popup');
        this.addImagePopupObserver.showAddImagePopup();
    }
}