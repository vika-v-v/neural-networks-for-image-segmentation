import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component'; // Make sure this import path is correct
import { ImageCategoriesMenuComponent } from './comparation-page/comparation-section/image-categories-menu/image-categories-menu.component';
import { ComparationSectionComponent } from './comparation-page/comparation-section/comparation-section.component';
import { ImageInformationComponent } from './comparation-page/image-information/image-information.component';
import { SegmentedImageComponent } from './comparation-page/comparation-section/segmented-image/segmented-image.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ComparationPageComponent } from './comparation-page/comparation-page.component';
import { SegmentedImageTimedComponent } from './home-page/segmented-image-timed/segmented-image-timed.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageCategoriesMenuComponent,
    ComparationSectionComponent,
    ImageInformationComponent,
    SegmentedImageComponent,
    HomePageComponent,
    ComparationPageComponent,
    SegmentedImageTimedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
