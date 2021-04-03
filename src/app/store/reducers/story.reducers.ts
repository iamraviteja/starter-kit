import { StoryActionTypes, StoryAction } from '@app/store/actions/story.actions';
import { Story } from '@app/store/models/Story';

export interface StoriesState {
  list: Story[];
  savedList: Story[];
  loading: boolean;
  error: Error;
}

const initialState: StoriesState = {
  list: [],
  savedList: [],
  loading: false,
  error: null,
};

export function StoryReducer(state: StoriesState = initialState, action: StoryAction) {
  switch (action.type) {
    case StoryActionTypes.FETCH_STORIES:
      return {
        ...state,
        loading: true,
      };
    case StoryActionTypes.FETCH_STORIES_SUCCESS:
      return {
        ...state,
        list: action.payload,
        loading: false,
      };
    case StoryActionTypes.FETCH_STORIES_FALIURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case StoryActionTypes.SAVE_STORY:
      return {
        ...state,
        savedList: [...state.savedList, state.list[action.payload]],
      };
    default:
      return state;
  }
}
