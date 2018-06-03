import { localStorageSync } from 'ruve-ngrx-store-localstorage';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { rootReducer } from './root.reducer';

const blacklistLocalStorageSync = [];

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: Object.keys(rootReducer).filter(
      v => !blacklistLocalStorageSync.includes(v)
    ),
    rehydrate: true,
    storage: localStorage
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer
];
