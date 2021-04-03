import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '@app/store/models/Story';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'portal-lib';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private BASE_URL = 'https://node-hnapi.herokuapp.com';
  constructor(private http: HttpClient, private request: RequestService) {}

  /**
   * fetchFeedByType
   */
  public fetchFeedByType(feedType: string, page: number): Observable<Story[]> {
    const url = `${this.BASE_URL}/${feedType}?page=${page}`;
    return this.http.get<Story[]>(url);
  }
}
