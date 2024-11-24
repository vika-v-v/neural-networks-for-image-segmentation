import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { NNetworkService } from './nnetwork.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private nnService: NNetworkService) { }

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

  removeImage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/images/remove/` + id);
  }

  saveAndProcessImage(image: { url: string; undercategories: number[] }): Observable<any> {
    return this.saveImage(image).pipe(
      switchMap((saveResponse: { imgId: number }) => {
        const imgId = saveResponse.imgId;
        return this.nnService.getNeuralNetworks().pipe(
          switchMap((networks: any[]) => {
            const processingRequests = networks.map((network) =>
              this.processImage(imgId, network.id)
            );
            return forkJoin(processingRequests).pipe(
              map(() => ({
                message: 'Image saved and processed successfully',
                imgId,
              }))
            );
          })
        );
      })
    );
  }

  updateImage(imageId: number, image: { url: string; undercategories: number[] }): Observable<any> {
    return this.http.put(`${this.baseUrl}/images/update/${imageId}`, image);
  }
  
  updateAndProcessImage(imageId: number, image: { url: string; undercategories: number[] }): Observable<any> {
    return this.updateImage(imageId, image).pipe(
      switchMap((updateResponse: any) => {
        return this.nnService.getNeuralNetworks().pipe(
          switchMap((networks: any[]) => {
            const processingRequests = networks.map((network) =>
              this.processImage(imageId, network.id)
            );
            return forkJoin(processingRequests).pipe(
              map(() => ({
                message: 'Image updated and processed successfully',
                imageId,
              }))
            );
          })
        );
      })
    );
  }
  
  
}
