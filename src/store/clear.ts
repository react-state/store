import { Store } from './store';
import { Map } from 'immutable';
import { tap, take } from 'rxjs/operators';
import { ActionType } from '../debug/debug-info-data';

export class Clear {
    constructor(debugMessage: string = null) {
        let clered = false;

        const clearMainStore = function (store: Store<any>) {
            store
                .update((state: Map<any, any>) => {
                    state.clear();
                }, true, { message: debugMessage, actionType: ActionType.Clear });
        };

        let actionWrapper = function () {
            if (clered) {
                return;
            }

            clered = true;

            clearMainStore(this);

        }.bind(this);

        (<any>this).pipe(
            tap(actionWrapper),
            take(1)
        ).subscribe();

        return this;
    }
}

export interface ClearSignature {
    <R>(debugMessage?: string ): R;
}