import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '@app/models/Story';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private BASE_URL = 'https://node-hnapi.herokuapp.com';
  constructor(private http: HttpClient) {}

  /**
   * fetchFeedByType
   */
  public fetchFeedByType(feedType: string, page: number): Observable<Story[]> {
    const url = `${this.BASE_URL}/${feedType}?page=${page}`;
    return this.http.get<Story[]>(url);
  }
}
