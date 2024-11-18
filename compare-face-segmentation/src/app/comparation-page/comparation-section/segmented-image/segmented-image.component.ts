import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ImageService } from '../../../server-communication/image.service';
import { ImageInformationPositionService } from '../../image-information/image-information-position.service';
import { ImageInformationFormat } from '../../image-information/image-information-format.class';
import { CommonModule } from '@angular/common';

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

  constructor(private imageService: ImageService, private positioningService: ImageInformationPositionService) { }

  ngAfterViewInit(): void {
    this.ctx = this.segmentCanvas.nativeElement.getContext('2d', { willReadFrequently: true })!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['image'] && this.image) {
      this.imageService.getLabelsWithSections(this.neuralNetwork.id, this.image.img_id).subscribe({
        next: (result: any) => {
          this.image.processedData = result;
          this.processedData = result;
          this.loadOriginalImage();
        },
        error: (error: any) => console.error('Error fetching image data:', error)
      });

    }
  }

  private loadOriginalImage(): void {
    if (this.image && this.image.image) {
      this.originalImage = new Image();
      this.originalImage.src = this.image.image;
      this.originalImage.onload = () => {
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
    this.processedData.forEach((segment: any, index: any) => {
      const segmentImage = new Image();
      segmentImage.src = 'data:image/jpeg;base64,' + segment.base64;
      segmentImage.onload = () => {
        this.segmentImages[index] = segmentImage;
        this.onMouseLeave();
      };
    });
  }

  onMouseMove(event: MouseEvent): void {
    const rect = this.segmentCanvas.nativeElement.getBoundingClientRect();
    const scaleX = this.segmentCanvas.nativeElement.width / rect.width;
    const scaleY = this.segmentCanvas.nativeElement.height / rect.height;

    // mouse position
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    for (let i = 0; i < this.segmentImages.length; i++) {
      const segmentImage = this.segmentImages[i];
      if (segmentImage && segmentImage.complete && segmentImage.naturalHeight !== 0) {
        this.ctx.clearRect(0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
        this.ctx.drawImage(segmentImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        if (imageData[3] > 0) { // If the pixel is not transparent
          this.highlightedLabel = this.processedData[i].label;
          this.ctx.clearRect(0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
          this.ctx.drawImage(this.originalImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
          this.ctx.drawImage(segmentImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
          break; // Show only the first non-transparent segment
        }
      }
    }

    this.positioningService.showInformationPanelForImage(this.segmentCanvas.nativeElement, this.getImageInformation());
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
    this.ctx.clearRect(0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
    this.ctx.drawImage(this.originalImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);

    for (let i = 0; i < this.segmentImages.length; i++) {
      const segmentImage = this.segmentImages[i];
      if (segmentImage && segmentImage.complete && segmentImage.naturalHeight !== 0) {
        this.ctx.drawImage(segmentImage, 0, 0, this.segmentCanvas.nativeElement.width, this.segmentCanvas.nativeElement.height);
      }
    }

    this.positioningService.showInformationPanelForImage(null);
  }

  onScroll(): void {
    console.log('scroll');
  }
}
