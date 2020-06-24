import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { listMiddleware, initMiddleware } from './list/middleware';
import rootReducer from './root-reducer';
import { IListHttpClient } from '../types';


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares: Middleware[] = [
  listMiddleware
];


function configureStore(initialState?: {}) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}


const store = configureStore();
export default store;


export const initStore = (listClient: IListHttpClient) => {
  initMiddleware(listClient);
};