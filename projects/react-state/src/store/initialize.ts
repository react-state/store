import { Helpers } from '../helpers/helpers';
import { tap, take } from 'rxjs/operators';
import { Store } from './store';
import { ActionType } from '../debug/debug-info-data';
import { DebugInfo } from '../debug/debug-info';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class Initialize {
    newStore: Store<any>;

    constructor(statePath, initialState: any = null) {
        const initialized = '__initialized';

        let actionWrapper = function (state: any) {
            if (DataStrategyProvider.instance.getIn(state, [...statePath, initialized])) {
                return;
            }

            DataStrategyProvider.instance.overrideContructor(initialState);
            initialState.constructor = Object;
            initialState = DataStrategyProvider.instance.fromJS(initialState);
            initialState = DataStrategyProvider.instance.set(initialState, initialized, true);

            let newState;

            try {
                newState = DataStrategyProvider.instance.setIn(state, statePath, initialState);
                this.newStore = (<any>this).select(statePath);
                this.newStore.initialState = initialState;
                this.newStore.rootPath = statePath;
            } catch (exception) {
                console.error(exception);
            }

            (<any>this).source.next(newState);
        }.bind(this);

        const defaultDebugInfo = { actionType: ActionType.Initialize, statePath: statePath };
        DebugInfo.instance.add(defaultDebugInfo);

        (<any>this).pipe(
            tap(actionWrapper),
            take(1)
        ).subscribe();

        return this.newStore as any;
    }
}

export interface InitializeSignature<T> {
    <R>(statePath, initialState?: T, addToHistory?: boolean): Store<R>;
}