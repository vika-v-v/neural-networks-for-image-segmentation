import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DeletePopupComponent } from './popups/delete-popup/delete-popup.component';
import { ImageCategoriesMenuComponent } from './comparation-page/comparation-section/image-categories-menu/image-categories-menu.component';
import { ComparationPageComponent } from './comparation-page/comparation-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AddImagePopupComponent } from './popups/add-image-popup/add-image-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    DeletePopupComponent,
    ImageCategoriesMenuComponent,
    ComparationPageComponent,
    HomePageComponent,
    AddImagePopupComponent
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('comparationPage', { static: false }) comparationPage!: ElementRef;
  comparationPageNativeElement: any;

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    if (!this.comparationPage) {
      console.error('ComparationPage not found');
    }
    else {
      this.comparationPageNativeElement = this.comparationPage.nativeElement;
    }
  }

  scrollToComparationPage() {
    if (this.comparationPageNativeElement) {
      this.comparationPageNativeElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('ComparationPage is not defined or nativeElement is missing');
    }
  }
}
