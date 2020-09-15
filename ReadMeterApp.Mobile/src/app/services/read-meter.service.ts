import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadMeterResult } from '../models/read-meter-result';

@Injectable({
  providedIn: 'root'
})
export class ReadMeterService {

  constructor(private readonly httpClient: HttpClient) { }

  read(image: string) {
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post<ReadMeterResult>('ReadMeter', formData).toPromise();
  }
}
