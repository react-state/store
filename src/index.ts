import { History } from 'history';
import { RouterState } from "./state/router-state";
import { State } from "./state/state";
import { StateHistory } from "./state/history";
import { Store } from "./store/store";
import { HistoryController } from "./state/history-controller";
import { take, switchMap } from "rxjs/operators";

export class ReactState {
    static init(
        domRender: (history: History) => void,
        initialState: any,
        isProd: boolean = false,
        debugMode = false,
        enableSSR = false
    ) {
        const store = new Store(new State(initialState));
        const history = new StateHistory();
        history.init(initialState, debugMode);
        const routerHistory = new RouterState(store, enableSSR).init();

        new HistoryController(store, history).init();
        HistoryController.routerHistory = routerHistory;

        if(!isProd) {
            (<any>window).state = StateHistory;
        }

        Store.store = store;
        ReactState.initRenderDom(store, domRender, routerHistory.history);
    }

    private static initRenderDom(store: Store<any>, domRender: (history: History) => void, routerHistory: History) {
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