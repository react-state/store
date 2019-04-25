import { History } from 'history';
import { RouterState } from "./state/router-state";
import { State } from "./state/state";
import { StateHistory, StateHistoryOptions, StateKeeper } from "./state/history";
import { Store } from "./store/store";
import { HistoryController } from "./state/history-controller";
import { take } from "rxjs/operators";
import { DebugInfo, DebugOptions } from './debug/debug-info';

class ReactStateInitializer {
    init(
        domRender: (history: History) => void,
        initialState: any,
        isProd: boolean,
        enableSSR = false
    ): void {
        StateHistory.instance.init(initialState);

        const store = new Store(new State(initialState));
        const routerHistory = new RouterState(store, enableSSR);

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
        DebugInfo.instance.changeDefaults(options);

        if (enableInitialDebugging) {
            DebugInfo.instance.init(true);
        }

        return this;
    }

    changeHistoryDefaultOptions(options: StateHistoryOptions): ReactStateInitializer {
        StateHistory.instance.changeDefaults(options);
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