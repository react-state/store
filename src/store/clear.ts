import { Store } from './store';
import { StateHistory } from '../state/history';
import { fromJS, Map } from 'immutable';
import { tap, take } from 'rxjs/operators';
import { ActionType } from './debug-info-data';

export class Clear {
    constructor(debugMessage: string = null) {
        let clered = false;

        const clearMainStore = function (store: Store<any>) {
            store
                .select([])
                .update((state: Map<any, any>) => {
                    const router = state.get('router');
                    state.clear();
                    state.merge(fromJS(StateHistory.initialState));
                    state.set('router', router);
                    state.setIn(['router', 'url'], '');
                });
        };

        let actionWrapper = function () {
            if (clered) {
                return;
            }

            clered = true;

            clearMainStore(this);

        }.bind(this);

        StateHistory.debugInfo = {
            message: debugMessage,
            actionType: ActionType.Clear,
            statePath: (<any>this).statePath
        };

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