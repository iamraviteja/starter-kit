import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '@app/store/models/Story';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '@app/@core/http/request/request.service';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private BASE_URL = 'https://node-hnapi.herokuapp.com';
  constructor(private _http: HttpClient, private http: RequestService) {}

  /**
   * fetchFeedByType
   */
  public fetchFeedByType(feedType: string, page: number): Observable<Story[]> {
    const url = `${this.BASE_URL}/${feedType}?page=${page}`;
    return this._http.get<Story[]>(url);
  }

  /**
   * getData
   */
  public getData() {
    return this.http.get('secret', null);
  }
}
