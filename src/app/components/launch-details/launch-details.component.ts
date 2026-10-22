import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, shareReplay, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as LaunchActions from '../../state/launch.actions';
import {
  selectIsFavorite,
  selectIsLoading,
  selectLaunchById,
  selectLaunchError
} from '../../state/launch.selectors';

@Component({
  selector: 'app-launch-details',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './launch-details.component.html',
  styleUrls: ['./launch-details.component.scss']
})
export class LaunchDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  private readonly launchId$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => id !== null),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly launch$ = this.launchId$.pipe(
    switchMap(id => this.store.select(selectLaunchById(id)))
  );
  readonly favorite$ = this.launchId$.pipe(
    switchMap(id => this.store.select(selectIsFavorite(id)))
  );
  readonly loading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectLaunchError);

  constructor() {
    this.launchId$.pipe(takeUntilDestroyed()).subscribe(id => {
      this.store.dispatch(LaunchActions.loadLaunchDetails({ id }));
    });
  }

  toggleFavorite(id: number): void {
    this.store.dispatch(LaunchActions.toggleFavorite({ id: String(id) }));
  }
}
