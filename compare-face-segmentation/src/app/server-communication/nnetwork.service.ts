import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NNetworkService {
  constructor(private http: HttpClient) { }
  
  getNeuralNetworks(): Observable<any[]>  {
    return this.http.get<any[]>('http://localhost:3000/neuralNetworks');
  }
}
