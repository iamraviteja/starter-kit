import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { environment } from '@env/environment';
import { AppState } from '@app/store/models/AppState';
import { Observable } from 'rxjs';
import { Story } from '@app/store/models/Story';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public version: string | null = environment.version;
  public stories: Observable<Array<Story>> = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.stories = this.store.select((store) => {
      console.log(store);
      return store.stories.savedList;
    });
  }
}
