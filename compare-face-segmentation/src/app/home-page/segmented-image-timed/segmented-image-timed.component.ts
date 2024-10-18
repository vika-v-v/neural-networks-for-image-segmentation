import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ImageService } from '../../server-communication/image.service';
import { ImageInformationPositionService } from '../../comparation-page/image-information/image-information-position.service';
import { ImageInformationFormat } from '../../comparation-page/image-information/image-information-format.class';
import { Subscription, interval, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-segmented-image-timed',
  templateUrl: './segmented-image-timed.component.html',
  styleUrl: './segmented-image-timed.component.css'
})
export class SegmentedImageTimedComponent {
  @Input() imageId!: number;
  originalImageUrl!: string;

  segmentSrc: string | null = null;
  segment: any = null;

  private fetchInterval!: Subscription;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.loadOriginalImage();

    this.fetchInterval = timer(1000, 7000).subscribe(() => {
      this.segmentSrc = null;
      this.loadSegment();
    });
  }

  loadOriginalImage(): void {
    this.imageService.getImage(this.imageId).subscribe({
      next: (response) => {
        this.originalImageUrl = response.image;
      },
      error: (error) => console.error('Error fetching image:', error)
    });
  }

  loadSegment(): void {
    this.imageService.getRandomSegment(this.imageId).subscribe({
      next: (response) => {
        this.segmentSrc = 'data:image/jpeg;base64,' + response.base64;
        this.segment = response;
      },
      error: (error) => console.error('Error fetching segment:', error)
    });
  }

  ngOnDestroy(): void {
    if (this.fetchInterval) {
      this.fetchInterval.unsubscribe();
    }
  }

  /*
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
      color: segment.color
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
  }*/

}
