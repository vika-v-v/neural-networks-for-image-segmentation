# Adding new popup

Popups are any windows that are shown above the website, f. e. adding/editing images or categories. If you need to add another one, follow theese steps:

1) create the popup in the folder popups, develop the popup
2) in popups/popup-controller.service.ts, add interface to define the function that would open the popup:
export interface deletePopupObserver {
    showDeleteCategoryPopup(category: any): void;
    // later add show image delete popup
}

3) in popups/popup-controller.service.ts, add a function to add the observer and to trigger the change:
    deletePopupObserver!: deletePopupObserver;

    addDeletePopupObserver(observer: deletePopupObserver): void {
        this.deletePopupObserver = observer;
    }

    showDeleteCategoryPopup(category: any): void {
        this.deletePopupObserver.showDeleteCategoryPopup(category);
    }

4) Initialize the popup in app.component.html under the popups div:
<div id="popups">
  <app-delete-popup></app-delete-popup>
</div>

5) Trigger the showing of the popup by calling this.popupController.showAddImagePopup();, where popupController is the constructor-injected service.