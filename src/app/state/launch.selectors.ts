import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LaunchState } from './launch.reducer';

export const selectLaunchState = createFeatureSelector<LaunchState>('launch');

export const selectAllLaunches = createSelector(selectLaunchState, state => state.launches);
export const selectIsLoading = createSelector(selectLaunchState, state => state.loading);
export const selectFavoriteIds = createSelector(selectLaunchState, state => state.favoriteIds);
export const selectLaunchError = createSelector(selectLaunchState, state => state.error);
export const selectLaunchById = (id: string) => createSelector(
  selectLaunchState,
  launchState => launchState.launches.find(launch => String(launch.flight_number) === id)
);
export const selectIsFavorite = (id: string) => createSelector(
  selectFavoriteIds,
  favoriteIds => favoriteIds.includes(id)
);