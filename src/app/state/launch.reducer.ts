import { createReducer, on } from '@ngrx/store';
import * as LaunchActions from './launch.actions';
import { Launch } from '../models/launch';

export interface LaunchState {
  launches: Launch[];
  favoriteIds: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: LaunchState = {
  launches: [],
  favoriteIds: [],
  loading: false,
  error: null
};

export const launchReducer = createReducer(
  initialState,
  on(LaunchActions.loadLaunches, state => ({ ...state, loading: true, error: null })),
  on(LaunchActions.loadLaunchesSuccess, (state, { launches }) => ({ ...state, loading: false, launches })),
  on(LaunchActions.loadLaunchesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(LaunchActions.loadLaunchDetails, state => ({...state, loading: true, error: null })),
  on(LaunchActions.loadLaunchDetailSuccess, (state, { launch }) => ({
    ...state,
    loading: false,
    launches: launch && !state.launches.some(existing => existing.flight_number === launch.flight_number) 
    ? [...state.launches, launch] 
    : state.launches
  })),
  on(LaunchActions.loadLaunchDetailFailure, (state, { error }) => ({...state, loading: false, error })),
  on(LaunchActions.toggleFavorite, (state, { id }) => ({
    ...state,
    favoriteIds: state.favoriteIds.includes(id)
      ? state.favoriteIds.filter(favId => favId !== id)
      : [...state.favoriteIds, id]
  }))
);