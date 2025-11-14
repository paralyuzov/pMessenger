import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GifApiResponse } from '../../models/Gif';

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private readonly http = inject(HttpClient);

  getTrendingGifs(limit: number = 25, offset: number = 0) {
    const url = `${environment.API_URL}trending?api_key=${environment.API_KEY}&limit=${limit}&offset=${offset}`;
    return this.http.get<GifApiResponse>(url);
  }

  searchGifs(query: string, limit: number = 25, offset: number = 0) {
    const url = `${environment.API_URL}search?api_key=${environment.API_KEY}&q=${encodeURIComponent(
      query
    )}&limit=${limit}&offset=${offset}`;
    return this.http.get<GifApiResponse>(url);
  }
}
