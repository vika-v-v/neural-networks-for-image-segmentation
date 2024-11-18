import { Injectable } from '@angular/core';

export interface deletePopupObserver {
    showDeleteCategoryPopup(category: any): void;
    // later add show image delete popup
}

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class PopupController {

    deletePopupObserver!: deletePopupObserver;

    addDeletePopupObserver(observer: deletePopupObserver): void {
        this.deletePopupObserver = observer;
    }

    showDeleteCategoryPopup(category: any): void {
        this.deletePopupObserver.showDeleteCategoryPopup(category);
    }
}