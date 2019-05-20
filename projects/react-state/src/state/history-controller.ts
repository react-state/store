import { Store } from '../store/store';
import { StateHistory } from './history';
import { ReplaySubject, Subject } from 'rxjs';
import { RouterState } from './router-state';
import { DebugInfo, DebugHistoryItem } from '../debug/debug-info';
import { take } from 'rxjs/operators';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class HistoryController {
    private static onHistoryChange = new ReplaySubject<boolean>(1);
    private onHistoryChange = new Subject();

    constructor(private store: Store<any>, private routerState: RouterState) {
    }

    init() {
        this.store.subscribe(state => {
            const isIntialState = !StateHistory.instance.currentState;

            StateHistory.instance.setCurrentState(state);
            DebugInfo.instance.onStateChange(state, isIntialState);
            HistoryController.onHistoryChange.next(true);
        });

        DebugInfo.instance.onApplyHistory.subscribe(this.applyHistory);
    }

    applyHistory = (debugHistoryItem: DebugHistoryItem) => {
        DebugInfo.instance.turnOnTimeTravel();

        const targetRoute = DataStrategyProvider.instance.getIn(debugHistoryItem.state, ['router', 'url']);
        if (targetRoute && this.routerState.currentRoute !== targetRoute) {
            this.routerState.history.push(targetRoute);
        }

        this.applyState(debugHistoryItem.state, debugHistoryItem.statePath);

        this.onHistoryChange
            .pipe(take(1))
            .subscribe(_ => {
                DebugInfo.instance.turnOffTimeTravel();
            });
    }

    private applyState(targetState: any, statePath: string[]) {
        if (statePath.length === 0) {
            Store.store.select(statePath).next(targetState);
        } else {
            Store.store.select(statePath)
                .update((state: any) => {
                    DataStrategyProvider.instance.setIn(state, statePath, targetState, { fromUpdate: true });
                });
        }
    }
}