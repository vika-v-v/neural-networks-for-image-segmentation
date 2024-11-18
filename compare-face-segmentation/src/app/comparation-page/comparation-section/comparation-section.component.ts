import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ImageService } from '../../server-communication/image.service';
import { HttpClient } from '@angular/common/http';
import { ImageInformationPositionService } from '../image-information/image-information-position.service';
import { ImageInformationFormat } from '../image-information/image-information-format.class';
import { NNetworkService } from '../../server-communication/nnetwork.service';
import { SegmentedImageComponent } from './segmented-image/segmented-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comparation-section',
  templateUrl: './comparation-section.component.html',
  styleUrls: ['./comparation-section.component.css'],
  standalone: true,
  imports: [
    SegmentedImageComponent,
    CommonModule
  ]
})
export class ComparationSectionComponent implements OnChanges {
  images: any[] = [];
  undercategsWithCache: number[] = [];
  neuralNetworks: any = [];

  @Input() currentUndercategoryId: number = 1;

  showTitle: number | null = null;

  currentHtmlElement: HTMLElement | null = null;
  currentImageInformation: ImageInformationFormat | null = null;

  constructor(private imageService: ImageService, private nNetwors: NNetworkService, private http: HttpClient, private positioningService: ImageInformationPositionService) {
    nNetwors.getNeuralNetworks().subscribe({
      next: (response) => {
        this.neuralNetworks = response;
      },
      error: (error) => console.error('Error fetching neural networks:', error)
    });
    this.updateVisibleImages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUndercategoryId'] && this.currentUndercategoryId !== null) {
      this.updateVisibleImages();
    }
  }

  private updateVisibleImages(): void {
    if (this.currentUndercategoryId !== null) {
      // check wether already processed
      if(this.undercategsWithCache.includes(this.currentUndercategoryId)) {
        this.images.forEach(image => {
          image.visible = image.undercategoryId === this.currentUndercategoryId;
        });
        return;
      }

      // the category wasn't selected before
      const sub = this.imageService.getImages(this.currentUndercategoryId).subscribe({
        next: (response) => {
          this.undercategsWithCache.push(this.currentUndercategoryId);

          // Mark all images as not visible initially.
          this.images.forEach(image => {
            image.visible = false;
          });
  
          response.images.forEach((newImage: any) => {
            const existingImageIndex = this.images.findIndex(image => image.img_id === newImage.img_id);
            if (existingImageIndex !== -1) {
              // Mark the existing image as visible
              this.images[existingImageIndex].visible = true;
            } else {
              // If the image is new, initialize its properties
              newImage.visible = true;
              newImage.processedData = [];
              newImage.undercategoryId = this.currentUndercategoryId;
              this.images.push(newImage);
            }
          });
        },
        error: (error) => console.error('Error fetching images:', error)
      });
    }
  }

  onMouseMove(event: MouseEvent, img_id: number, network_id: number) {
    const element = (event.target as HTMLElement);
    this.positioningService.showInformationPanelForImage(element, this.formImageInformation(img_id, network_id));
    
    this.currentHtmlElement = element;
  }
  
  onScroll(): void {
    if (!this.currentHtmlElement) {
      this.positioningService.showInformationPanelForImage(null);
      return;
    }
    
    this.positioningService.showInformationPanelForImage(this.currentHtmlElement, this.currentImageInformation);
  }
  
  private formImageInformation(img_id: number, network_id: number): ImageInformationFormat | null{
    let imageInformation = null;
    let image = this.images.find(img => img.img_id === img_id);
    
    if(network_id == -1) {
      imageInformation = new ImageInformationFormat(
                "Original image", 
                [{ key: "Origin" , value: image.img_origin }]);
    }
    
    this.currentImageInformation = imageInformation;
    return imageInformation;
  }
  
  onMouseLeave(): void {
    this.positioningService.showInformationPanelForImage(null);
    this.currentHtmlElement = null;
    this.currentImageInformation = null;
    this.currentlyHighlighted = null;
  }

  currentlyHighlighted: {imgId: number, networkId: number, segmentLabel: string} | null = null;

  onMouseEnter(segment: any, imageId: any, networkId: any): void {
    this.currentlyHighlighted = { imgId: imageId, networkId: networkId, segmentLabel: segment.label };
  }

  isHighlighted(imageId:any, networkId:any, segmentLabel:any): any {
    return this.currentlyHighlighted && this.currentlyHighlighted.imgId === imageId && this.currentlyHighlighted.networkId === networkId && this.currentlyHighlighted.segmentLabel === segmentLabel;
  }

  updateImageHeight(imageId: number, event: Event): void {
    const target = event.target as HTMLElement; // Perform type assertion here
    const height = target.offsetHeight;
    const imageIndex = this.images.findIndex(img => img.img_id === imageId);
    if (imageIndex !== -1) {
      this.images[imageIndex].height = height; // Update the height in your images array
    }
  }
  
}
