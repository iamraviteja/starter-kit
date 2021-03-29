import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Story } from '@app/models/Story';

import { FeedService } from './feed.service';
import { NetworkStatusService } from 'portal-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  isOffline = false;
  stories: Story[] = [];

  constructor(private feedService: FeedService, private networkService: NetworkStatusService) {}

  ngOnInit() {
    this.isLoading = true;
    this.feedService
      .fetchFeedByType('news', 1)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: Story[]) => {
        this.stories = data;
      });
    this.networkService.getNetworkStatus().subscribe((offlineStatus: boolean) => {
      this.isOffline = offlineStatus;
    });
  }
}
