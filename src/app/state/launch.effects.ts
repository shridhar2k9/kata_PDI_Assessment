import { Injectable,inject } from '@angular/core';
import { Actions,createEffect,ofType} from '@ngrx/effects'
import { SpacexService } from '../services/spacex';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import * as LaunchActions from './launch.actions';


@Injectable()
export class LaunchEffects {
    private readonly actions$ = inject(Actions);
    private readonly spacexService = inject(SpacexService);

    loadLaunchEffects$ = createEffect(()=>
        this.actions$.pipe(
            ofType(LaunchActions.loadLaunches),
            exhaustMap(() =>
                this.spacexService.getPastLaunches().pipe(
                    map(launches => LaunchActions.loadLaunchesSuccess({ launches })),
                    catchError((error:unknown) => of(LaunchActions.loadLaunchesFailure({ error:this.getErrorMessage(error) })))
                )
            )
        )
    );
    loadLaunchDetails$ = createEffect(()=>
        this.actions$.pipe(
            ofType(LaunchActions.loadLaunchDetails),
            mergeMap(({ id }) =>
                this.spacexService.getLaunchById(id).pipe(
                    map(launch => LaunchActions.loadLaunchDetailSuccess({ launch })),
                    catchError((error: unknown) => of(LaunchActions.loadLaunchDetailFailure({ error: this.getErrorMessage(error) })))
                )
            )
        )
    );
    private getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : 'Unable to load launch data.';
    }
}