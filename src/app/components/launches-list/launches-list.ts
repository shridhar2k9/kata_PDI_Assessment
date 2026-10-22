import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpacexService } from '../../services/spacex';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { selectAllLaunches, selectFavoriteIds, selectIsFavorite, selectIsLoading, selectLaunchError } from '../../state/launch.selectors';
import * as LaunchActions from '../../state/launch.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { Launch } from '../../models/launch';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-launches-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, 
    MatIconModule, MatChipsModule, MatButtonModule, MatProgressBarModule, RouterLink, MatTooltipModule],
  templateUrl: './launches-list.html',
  styleUrl: './launches-list.scss'
})
export class LaunchesListComponent {

  readonly searchTerm = signal('');
  private store = inject(Store); 
  
  readonly loading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectLaunchError); 
  readonly favoriteIds = toSignal(this.store.select(selectFavoriteIds), { initialValue: [] });

  private readonly launchesSignal = toSignal(this.store.select(selectAllLaunches), { initialValue: [] });


  readonly filteredLaunches = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.launchesSignal().filter(launch => 
      launch.mission_name.toLowerCase().includes(term)
    );
  });

  constructor(private spacexService: SpacexService) {
    this.store.dispatch(LaunchActions.loadLaunches());
  }

  onSearchChange(event: Event) {    
    if(event.target instanceof HTMLInputElement) {
      this.searchTerm.set(event.target.value);
    }
  }
  isFavorite(launch: Launch):boolean {
    return this.favoriteIds().includes(String(launch.flight_number));
  }
  toggleFavorite(launch: Launch) {
    this.store.dispatch(LaunchActions.toggleFavorite({ id: String(launch.flight_number) }));
  }
}