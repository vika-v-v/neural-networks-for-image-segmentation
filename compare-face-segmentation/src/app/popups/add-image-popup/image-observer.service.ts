import { Injectable } from '@angular/core';

export interface ImageObserver {
    imageAdded(id: number): void;
}

@Injectable({
  providedIn: 'root', // This makes the service available globally
})
export class ImageObserverService {
  imageObservers: ImageObserver[] = [];

  addImageObserver(observer: ImageObserver): void {
    this.imageObservers.push(observer);
  }

  imageAdded(id: number): void {
    this.imageObservers.forEach(observer => observer.imageAdded(id));
  }
}