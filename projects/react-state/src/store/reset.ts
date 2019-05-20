import { Store } from './store';
import { StateHistory, StateKeeper } from '../state/history';
import { Helpers } from '../helpers/helpers';
import { ActionType } from '../debug/debug-info-data';
import { RouterState } from '../state/router-state';
import { DebugInfo } from '../debug/debug-info';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class Reset {
    constructor(debugMessage: string = null) {

        const restoreState = function (store: Store<any>) {
            let path = store.statePath.filter(item => !store.rootPath.includes(item));
            const isRootPath = Array.isArray(path) && path.length === 0;
            if (isRootPath) {
                DataStrategyProvider.instance.resetRoot(StateHistory.instance.initialState, RouterState.startingRoute);
            } else {
                let initialState: any = !!store.initialState
                    ? store.initialState
                    : DataStrategyProvider.instance.fromJS(StateHistory.instance.initialState);

                initialState = DataStrategyProvider.instance.getIn(initialState, (path));

                DataStrategyProvider.instance.reset(store.statePath, initialState);
            }

            const defaultDebugInfo = { actionType: ActionType.Reset, statePath: path, debugMessage: debugMessage };
            DebugInfo.instance.add(defaultDebugInfo);
        };


        if (!DataStrategyProvider.instance.isObject(DataStrategyProvider.instance.getIn(StateKeeper.CURRENT_STATE, (this as any).statePath))) {
            throw new Error(`Cannot resotre state at path: ${(this as any).statePath}. Maybe you are trying to restore value rather then state.`);
        }

        restoreState((this as any));
    }
}

export interface ResetSignature {
    <R>(debugMessage?: string): void;
}