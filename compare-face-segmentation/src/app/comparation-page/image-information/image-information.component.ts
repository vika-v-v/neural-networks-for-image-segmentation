import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ImageInformationPositionService } from './image-information-position.service';
import { ImageInformationFormat } from './image-information-format.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-information',
  templateUrl: './image-information.component.html',
  styleUrl: './image-information.component.css',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ImageInformationComponent implements AfterViewInit {
  @ViewChild('targetElement', { static: true }) targetElement!: ElementRef;

  constructor(private positioningService: ImageInformationPositionService) { }

  ngAfterViewInit(): void {
    this.positioningService.initElementRef(this.targetElement);
    this.positioningService.showInformationPanelForImage(null);
  }

  getImageInformation(): ImageInformationFormat | null {

    return this.positioningService.getImageInformation();
  }

  isHighlighted(label: string | null): string {
    return label && this.getImageInformation()?.highlightedLabel === label ? 'highlighted' : '';
  }
  
  getOpaqueColor(color: string): string {
    if (color.length === 9) { // Checks if the color is in #rrggbbaa format
      return color.slice(0, 7); // Returns the color without the alpha component
    }
    return color; // Returns the original color if not in #rrggbbaa format
  }

}
