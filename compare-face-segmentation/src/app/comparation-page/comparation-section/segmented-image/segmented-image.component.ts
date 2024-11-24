import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ImageService } from '../../../server-communication/image.service';
import { ImageInformationPositionService } from '../../image-information/image-information-position.service';
import { ImageInformationFormat } from '../../image-information/image-information-format.class';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-segmented-image',
  templateUrl: './segmented-image.component.html',
  styleUrls: ['./segmented-image.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SegmentedImageComponent implements AfterViewInit, OnChanges {
  @Input() image!: any;
  @Input() neuralNetwork!: any;  
  @ViewChild('segmentCanvas') segmentCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private originalImage!: HTMLImageElement;
  private segmentImages: HTMLImageElement[] = [];
  private highlightedLabel: string | null = null;
  private processedData: any;

  private labelMap: Uint8Array = new Uint8Array(0);
  private allResourcesLoaded: boolean = false;

  private labelsSubscription: Subscription | null = null;
  private isActive: boolean = true; // To track if the component is still active


  constructor(private imageService: ImageService, private positioningService: ImageInformationPositionService) {}

  ngAfterViewInit(): void {
    this.ctx = this.segmentCanvas.nativeElement.getContext('2d', { willReadFrequently: true })!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['image'] && this.image) {
      // Unsubscribe from previous subscription if it exists
      if (this.labelsSubscription) {
        this.labelsSubscription.unsubscribe();
      }
  
      this.labelsSubscription = this.imageService.getLabelsWithSections(this.neuralNetwork.id, this.image.img_id).subscribe({
        next: (result: any) => {
          // Check if the component is still active
          if (!this.isActive) return;
  
          this.image.processedData = result;
          this.processedData = result;
          this.loadOriginalImage();
        },
        error: (error: any) => console.error('Error fetching image data:', error)
      });
    }
  }  

  ngOnDestroy(): void {
    this.isActive = false;
    if (this.labelsSubscription) {
      this.labelsSubscription.unsubscribe();
    }
    // Attempt to cancel image loading
    if (this.originalImage) {
      this.originalImage.onload = null;
      this.originalImage.src = '';
    }
    // Similarly for segment images
    this.segmentImages.forEach((img) => {
      if (img) {
        img.onload = null;
        img.src = '';
      }
    });
  }
  
  

  private loadOriginalImage(): void {
    if (this.image && this.image.image) {
      this.originalImage = new Image();
      this.originalImage.src = this.image.image;
      this.originalImage.onload = () => {
        if (!this.isActive) return;
  
        this.segmentCanvas.nativeElement.width = this.originalImage.naturalWidth;
        this.segmentCanvas.nativeElement.height = this.originalImage.naturalHeight;
        this.ctx.drawImage(this.originalImage, 0, 0, this.originalImage.naturalWidth, this.originalImage.naturalHeight);
        if (this.processedData) {
          this.loadSegmentImages();
        }
      };
    }
  }  

  private loadSegmentImages(): void {
    let loadedImages = 0;
    const totalImages = this.processedData.length;
  
    this.processedData.forEach((segment: any, index: any) => {
      const segmentImage = new Image();
      segmentImage.src = 'data:image/jpeg;base64,' + segment.base64;
      segmentImage.onload = () => {
        if (!this.isActive) return;
  
        this.segmentImages[index] = segmentImage;
        loadedImages++;
        if (loadedImages === totalImages) {
          // All segment images have loaded
          this.drawAllSegments();
          this.createLabelMap(); // Create label map after all images are loaded
          this.allResourcesLoaded = true;
        }
      };
    });
  }
  

  private createLabelMap(): void {
    const originalWidth = this.segmentCanvas.nativeElement.width;
    const originalHeight = this.segmentCanvas.nativeElement.height;
    const scaleFactor = 0.2; // Adjust this value (e.g., 0.2 for 20% of the original size)
    const width = Math.floor(originalWidth * scaleFactor);
    const height = Math.floor(originalHeight * scaleFactor);
    this.labelMap = new Uint8Array(width * height);
    this.labelMap.fill(255); // Initialize to 255 (no segment)
  
    for (let i = 0; i < this.segmentImages.length; i++) {
      const segmentImage = this.segmentImages[i];
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
      tempCtx.drawImage(segmentImage, 0, 0, width, height); // Draw at lower resolution
      const imageData = tempCtx.getImageData(0, 0, width, height).data;
  
      // Optimize the loop to check only the alpha channel
      const len = imageData.length;
      for (let p = 3; p < len; p += 4) {
        if (imageData[p] > 0) { // If alpha > 0
          const index = (p - 3) / 4;
          this.labelMap[index] = i;
        }
      }
    }
  }
  

  

  private drawAllSegments(): void {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
  
    // Draw the original image
    this.ctx.drawImage(this.originalImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
  
    // Draw all segment images
    for (let i = 0; i < this.segmentImages.length; i++) {
      const segmentImage = this.segmentImages[i];
      if (segmentImage && segmentImage.complete && segmentImage.naturalHeight !== 0) {
        this.ctx.drawImage(segmentImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
      }
    }
  }  
  

  onMouseMove(event: MouseEvent): void {
    if (!this.allResourcesLoaded) return;
  
    const rect = this.segmentCanvas.nativeElement.getBoundingClientRect();
    const scaleX = this.segmentCanvas.nativeElement.width / rect.width;
    const scaleY = this.segmentCanvas.nativeElement.height / rect.height;
  
    const scaleFactor = 0.2; // Same as used in createLabelMap
  
    // Adjust mouse position for scaled label map
    const x = Math.floor((event.clientX - rect.left) * scaleX * scaleFactor);
    const y = Math.floor((event.clientY - rect.top) * scaleY * scaleFactor);
    const width = Math.floor(this.segmentCanvas.nativeElement.width * scaleFactor);
    const height = Math.floor(this.segmentCanvas.nativeElement.height * scaleFactor);
  
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const index = y * width + x;
      const segmentIndex = this.labelMap[index];
      if (segmentIndex !== 255) { // 255 means no segment
        this.highlightedLabel = this.processedData[segmentIndex].label;
        this.ctx.clearRect(0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
        this.ctx.drawImage(this.originalImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
        this.ctx.drawImage(this.segmentImages[segmentIndex], 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
      } else {
        this.highlightedLabel = null;
        this.drawAllSegments();
      }
    } else {
      this.highlightedLabel = null;
      this.drawAllSegments();
    }
    // Update the information panel
    this.positioningService.showInformationPanelForImage(
      this.segmentCanvas.nativeElement,
      this.getImageInformation()
    );
  }
  
  

  getImageInformation(): ImageInformationFormat | null {

    const processedLabelsWithColors = this.processedData.map((segment: any) => ({
      label: segment.label,
      color: segment.color,
      score: segment.score
    }));

    const imageInformation = new ImageInformationFormat(
      "Processed image",
      [{ key: "Neural network", value: this.neuralNetwork.name }],
      processedLabelsWithColors,
      this.highlightedLabel);

    return imageInformation;
  }

  onMouseLeave(): void {
    if (!this.allResourcesLoaded) return;
    this.highlightedLabel = null;
    this.drawAllSegments();
    this.positioningService.showInformationPanelForImage(null);
  }

  onScroll(): void {
    console.log('scroll');
  }
}
