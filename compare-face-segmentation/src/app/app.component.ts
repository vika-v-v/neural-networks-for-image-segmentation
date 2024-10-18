import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
