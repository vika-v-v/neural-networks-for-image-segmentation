import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl = 'http://localhost:3000';

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

  // Save an image to the database
  saveImage(image: { url: string; undercategories: number[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/images/add`, image);
  }  

  // TODO: add the request process and save the image to the databases
  // Process the image with a specific neural network
  processImage(imgId: number, neuralNetworkId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getProcessedImageData/${neuralNetworkId}/${imgId}`);
  }

  // Force reprocess the image with a specific neural network
  forceProcessImage(imgId: number, neuralNetworkId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getProcessedImageData/force/${neuralNetworkId}/${imgId}`);
  }

  getRandomImageBase64(): Observable<string> {
    const url = `${this.baseUrl}/random-image`;
    return this.http.get(url, { responseType: 'text' }); // Specify response type as 'text'
  }
  
}
