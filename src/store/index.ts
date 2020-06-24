import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as itemsSelectors from './list/selectors';
import * as itemsActions from './list/actions';

export { default, initStore } from './store';
export { default as rootReducer } from './root-reducer';


export const selectors = {
  list: itemsSelectors,  
};


export const actions = {
  list: itemsActions,
};


export type RootState = StateType<typeof rootReducer>;
