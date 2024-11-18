export interface deletePopupObserver {
    showDeleteCategoryPopup(category: any): void;
    // later add show image delete popup
}

export class PopupController {

    deletePopupObservers: deletePopupObserver[] = [];

    addDeletePopupObserver(observer: deletePopupObserver): void {
        this.deletePopupObservers.push(observer);
    }

    showDeleteCategoryPopup(category: any): void {
        this.deletePopupObservers.forEach(observer => {
            observer.showDeleteCategoryPopup(category);
        });
    }
}