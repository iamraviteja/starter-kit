import { Action } from '@ngrx/store';
import { Story } from '@app/store/models/Story';

export enum StoryActionTypes {
  FETCH_STORIES = '[STORY] Fetch Items',
  FETCH_STORIES_SUCCESS = '[STORY] Fetch Items Success',
  FETCH_STORIES_FALIURE = '[STORY] Fetch Items Failure',
  SAVE_STORY = '[STORY] Save Item',
}

export class SaveStoryAction implements Action {
  readonly type = StoryActionTypes.SAVE_STORY;
  constructor(public payload: number) {}
}

export class FetchStoriesAction implements Action {
  readonly type = StoryActionTypes.FETCH_STORIES;
  constructor() {}
}

export class FetchStoriesSuccessAction implements Action {
  readonly type = StoryActionTypes.FETCH_STORIES_SUCCESS;
  constructor(public payload: Story[]) {}
}

export class FetchStoriesFaliureAction implements Action {
  readonly type = StoryActionTypes.FETCH_STORIES_FALIURE;
  constructor(public payload: Error) {}
}

export type StoryAction = SaveStoryAction | FetchStoriesAction | FetchStoriesSuccessAction | FetchStoriesFaliureAction;
