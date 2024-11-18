import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) { }

  getImages(undercategoryId: number): Observable<any> {
    const url = 'http://localhost:3000/imagesByUndercategory/' + undercategoryId;
    return this.http.get<any>(url);
  }

  getImage(imageId: number): Observable<any> {
    const url = 'http://localhost:3000/imageById/' + imageId;
    return this.http.get<any>(url);
  }

  getLabelsWithSections(neuralNetworkId: number, imgId: number): Observable<any> {
    const url = 'http://localhost:3000/getProcessedImageData/' + neuralNetworkId + "/" + imgId;
    return this.http.get<any>(url);
  }

  getRandomSegment(imgId: number): Observable<any> {
    const url = 'http://localhost:3000/getRandomSegment/' + imgId;
    return this.http.get<any>(url);
  }
}
