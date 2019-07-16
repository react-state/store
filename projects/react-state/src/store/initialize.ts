import { tap, take } from 'rxjs/operators';
import { Store } from './store';
import { ActionType } from '../debug/debug-info-data';
import { DebugInfo } from '../debug/debug-info';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';
import { BehaviorSubject } from 'rxjs';

export class Initialize {
    static execute<T>(store: Store<T>) {
        let newStore: Store<any>;

        const intiailize = function (statePath: any[], initialState: any = null) {
            const initialized = '__initialized';

            let actionWrapper = function (state: any) {
                if (DataStrategyProvider.instance.getIn(state, [...statePath, initialized])) {
                    return;
                }

                DataStrategyProvider.instance.overrideContructor(initialState);
                initialState.constructor = Object;
                initialState = DataStrategyProvider.instance.fromJS(initialState);
                initialState = DataStrategyProvider.instance.set(initialState, initialized, true);

                let newState: T;

                try {
                    newState = DataStrategyProvider.instance.setIn(state, statePath, initialState);
                    newStore = store.select(statePath);
                    newStore.initialState = initialState;
                    newStore.rootPath = statePath;
                } catch (exception) {
                    console.error(exception);
                }

                (store.source as BehaviorSubject<T>).next(newState);
            }.bind(this);

            const defaultDebugInfo = { actionType: ActionType.Initialize, statePath: statePath };
            DebugInfo.instance.add(defaultDebugInfo);

            store.pipe(
                tap(actionWrapper),
                take(1)
            ).subscribe();

            return this.newStore as any;
        };

        return intiailize;
    }
}

export interface InitializeSignature<T> {
    <R>(statePath, initialState?: T, addToHistory?: boolean): Store<R>;
}