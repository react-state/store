import { History } from 'history';
import { RouterState } from './state/router-state';
import { State } from './state/state';
import { StateHistory, StateHistoryOptions, StateKeeper } from './state/history';
import { Store } from './store/store';
import { HistoryController } from './state/history-controller';
import { take } from 'rxjs/operators';
import { DebugInfo, DebugOptions } from './debug/debug-info';
import { DataStrategy } from '@react-state/data-strategy';
import { DataStrategyProvider } from './data-strategy/data-strategy-provider';

class ReactStateInitializer {
    private enableInitialDebugging: boolean;

    init(
        domRender: (history: History) => void,
        initialState: any,
        isProd: boolean,
        enableSSR = false
    ): void {
        if (!DataStrategyProvider.instance) {
            throw new Error('Please provide data strategy: @react-state/immutablejs-data-strategy or @react-state/immer-data-strategy');
        }

        StateHistory.instance.init(initialState);

        const store = new Store(new State(initialState));
        const routerHistory = new RouterState(store, enableSSR);
        DataStrategyProvider.instance.init(store, isProd);

        if (this.enableInitialDebugging) {
            DebugInfo.instance.init(true);
        }

        new HistoryController(store, routerHistory).init();
        routerHistory.init();

        if (!isProd) {
            (<any>window).state = {
                history: StateKeeper,
                debug: DebugInfo.instance.publicApi
            };
        }

        Store.store = store;
        this.initRenderDom(store, domRender, routerHistory.history);
    }

    debugger(enableInitialDebugging: boolean, options: DebugOptions): ReactStateInitializer {
        this.enableInitialDebugging = enableInitialDebugging;
        DebugInfo.instance.changeDefaults(options);

        return this;
    }

    changeHistoryDefaultOptions(options: StateHistoryOptions): ReactStateInitializer {
        StateHistory.instance.changeDefaults(options);
        return this;
    }

    addDataStrategy<T extends DataStrategy>(dataStrategy: new () => T): ReactStateInitializer {
        DataStrategyProvider.instance = new dataStrategy();
        return this;
    }

    private initRenderDom(store: Store<any>, domRender: (history: History) => void, routerHistory: History) {
        store
            .pipe(
                take(1)
            )
            .subscribe(_ => {
                try {
                    domRender(routerHistory);
                } catch (exception) {
                    console.error(exception);
                }
            });
    }
}

const ReactState = new ReactStateInitializer();
export { ReactState };