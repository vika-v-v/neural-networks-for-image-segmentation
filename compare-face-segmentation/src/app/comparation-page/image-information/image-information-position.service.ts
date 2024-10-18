import { ElementRef, Injectable } from '@angular/core';
import { ImageInformationFormat } from './image-information-format.class';

@Injectable({
  providedIn: 'root'
})
export class ImageInformationPositionService {

  elementRef!: ElementRef;

  GAP_TO_THE_IMAGE = 30;
  imageInformation: ImageInformationFormat | null = null;

  constructor() { }

  initElementRef(element: ElementRef): void {
    this.elementRef = element;
  }

  getImageInformation(): ImageInformationFormat | null {
    return this.imageInformation;
  }

  showInformationPanelForImage(initialRect: HTMLElement | null, imageInformation?: ImageInformationFormat | null): void {
    if (!this.elementRef || !this.elementRef.nativeElement) {
      throw new Error('Invalid ElementRef provided to initElementRef');
    }

    if(initialRect === null) {
      this.elementRef.nativeElement.style.display = 'none';
      return;
    }
    const rect = this.calculateVisibleRect(initialRect);
    if(!rect) { return; }
    
    if(!imageInformation) { 
      this.imageInformation = null; 
      return; 
    }
  
    this.imageInformation = imageInformation;

    this.elementRef.nativeElement.style.display = 'block';
    const computedStyle = window.getComputedStyle(this.elementRef.nativeElement);
    const panelWidth = parseInt(computedStyle.width, 10);

    this.elementRef.nativeElement.style.left = `${rect.left - panelWidth - this.GAP_TO_THE_IMAGE}px`;
    this.elementRef.nativeElement.style.top = `${rect.top}px`;
  }

  private calculateVisibleRect(elem: HTMLElement): DOMRect | null {
    let elemRect = elem.getBoundingClientRect();
    
    let visibleRect = {
      top: elemRect.top,
      left: elemRect.left,
      bottom: elemRect.bottom,
      right: elemRect.right,
    };
    
    let currentParent = elem.parentElement;
    
    while (currentParent) {
      const parentRect = currentParent.getBoundingClientRect();
      
      visibleRect.top = Math.max(visibleRect.top, parentRect.top);
      visibleRect.left = Math.max(visibleRect.left, parentRect.left);
      visibleRect.bottom = Math.min(visibleRect.bottom, parentRect.bottom);
      visibleRect.right = Math.min(visibleRect.right, parentRect.right);
      
      currentParent = currentParent.parentElement;
    }
    
    const width = Math.max(0, visibleRect.right - visibleRect.left);
    const height = Math.max(0, visibleRect.bottom - visibleRect.top);
    
    return new DOMRect(
      visibleRect.left,
      visibleRect.top,
      width,
      height
    );
  }

}
