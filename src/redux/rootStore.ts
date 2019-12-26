import { createStore, compose, Store } from 'redux';
import { saveState, loadState } from 'services/LocalStorageService';
import rootReducer from './rootReducer';

// for redux debugging https://github.com/zalmoxisus/redux-devtools-extension#usage
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
  }
}

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const savedState = loadState();

const enhancer = composeEnhancers();

const store: Store = createStore(rootReducer, savedState, enhancer);

store.subscribe(() => {
  saveState({
    auth: store.getState().auth
  });
});

export default store;
