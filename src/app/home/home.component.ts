import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Story } from '@app/store/models/Story';

import { FeedService } from './feed.service';
import { NetworkStatusService } from 'portal-lib';
import { AppState } from '@app/store/models/AppState';
import { FetchStoriesAction, SaveStoryAction } from '@app/store/actions/story.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading$: Observable<Boolean>;
  isOffline = false;
  isError$: Observable<Error>;
  stories$: Observable<Story[]>;

  constructor(
    private feedService: FeedService,
    private networkService: NetworkStatusService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select((store) => store.stories.loading);
    this.stories$ = this.store.select((store) => store.stories.list);
    this.isError$ = this.store.select((store) => store.stories.error);
    // this.feedService
    //   .fetchFeedByType('news', 1)
    //   .pipe(
    //     finalize(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe((data: Story[]) => {
    //     this.stories = data;
    //   });
    this.networkService.getNetworkStatus().subscribe((offlineStatus: boolean) => {
      this.isOffline = offlineStatus;
    });

    this.store.dispatch(new FetchStoriesAction());
  }

  /**
   * saveStory
   */
  public saveStory(i: number) {
    this.store.dispatch(new SaveStoryAction(i));
  }
}
