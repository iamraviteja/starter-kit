import { StoriesState } from '@app/store/reducers/story.reducers';

export interface AppState {
  readonly stories: StoriesState;
}
