import { Component, EventEmitter, Output } from '@angular/core';
import { SegmentedImageComponent } from '../comparation-page/comparation-section/segmented-image/segmented-image.component';
import { SegmentedImageTimedComponent } from './segmented-image-timed/segmented-image-timed.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  standalone: true,
  imports: [
    SegmentedImageTimedComponent
  ]
})
export class HomePageComponent {
  @Output() scrollToComparation = new EventEmitter<void>();
}
