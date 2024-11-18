import { Component } from '@angular/core';
import { DeletePopupComponent } from '../popups/delete-popup/delete-popup.component';
import { ImageInformationComponent } from './image-information/image-information.component';
import { ImageCategoriesMenuComponent } from './comparation-section/image-categories-menu/image-categories-menu.component';
import { ComparationSectionComponent } from './comparation-section/comparation-section.component';

@Component({
  selector: 'app-comparation-page',
  templateUrl: './comparation-page.component.html',
  styleUrl: './comparation-page.component.css',
  standalone: true,
  imports: [
    DeletePopupComponent,
    ImageInformationComponent,
    ImageCategoriesMenuComponent,
    ComparationSectionComponent
  ]
})
export class ComparationPageComponent {
  title = 'compare-face-segmentation';
  selectedUndercategoryId: number = 1;

  handleUndercategorySelection(undercategoryId: number) {
    this.selectedUndercategoryId = undercategoryId;
  }
}
