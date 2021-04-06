import { Injectable } from '@angular/core';
import { FeedService } from '@app/home/feed.service';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  FetchStoriesAction,
  FetchStoriesFaliureAction,
  FetchStoriesSuccessAction,
  StoryActionTypes,
} from '../actions/story.actions';

@Injectable()
export class StoryEffects {
  public fetchStories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<FetchStoriesAction>(StoryActionTypes.FETCH_STORIES),
      mergeMap((action) =>
        this.feedService.fetchFeedByType('news', parseInt(action.payload)).pipe(
          map((data) => new FetchStoriesSuccessAction(data)),
          catchError((error) => of(new FetchStoriesFaliureAction(error)))
        )
      )
    );
  });
  constructor(private actions$: Actions, private feedService: FeedService) {}
}
