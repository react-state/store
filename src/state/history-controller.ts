import { Store } from '../store/store';
import { StateHistory } from './history';
import { ReplaySubject } from 'rxjs';
import { RouterState } from './router-state';
import { DebugInfo } from '../debug/debug-info';

export class HistoryController {
    private static onHistoryChange = new ReplaySubject<boolean>(1);
    static routerHistory: RouterState = null;

    constructor(private store: Store<any>) {
    }

    init() {
        this.store.subscribe(state => {
            const isIntialState = !StateHistory.instance.currentState;

            StateHistory.instance.add(state);
            DebugInfo.instance.onStateChange(state, isIntialState);
            HistoryController.onHistoryChange.next(true);
        });
    }

    static applyHistory(targetState: any, statePath: any[]) {
        const targetRoute = targetState.getIn(['router', 'url']);
        if (targetRoute && this.routerHistory.currentRoute !== targetRoute) {
            this.routerHistory.history.push(targetRoute);
        }

        this.applyState(targetState, statePath);

        return this.onHistoryChange;
    }

    private static applyState(targetState: any, statePath: string[]) {
        Store.store.select(statePath)
            .update((state: any) => {
                state.clear();
                state.merge(targetState);
            }, true);
    }
}