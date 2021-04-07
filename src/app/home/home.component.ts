import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Story } from '@app/store/models/Story';
import { NetworkStatusService } from 'portal-lib';
import { AppState } from '@app/store/models/AppState';
import { FetchStoriesAction, SaveStoryAction } from '@app/store/actions/story.actions';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FeedService } from './feed.service';

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
    private networkService: NetworkStatusService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select((store) => store.stories.loading);
    this.stories$ = this.store.select((store) => store.stories.list);
    this.isError$ = this.store.select((store) => store.stories.error);

    this.networkService.getNetworkStatus().subscribe((offlineStatus: boolean) => {
      this.isOffline = offlineStatus;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log('paramMap :: ', paramMap.get('page'), paramMap);
      this.store.dispatch(new FetchStoriesAction(paramMap.get('page')));
    });
  }

  /**
   * saveStory
   */
  public saveStory(i: number) {
    this.feedService.getData().subscribe();

    // this.store.dispatch(new SaveStoryAction(i));
  }
}
