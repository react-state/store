import * as Rx from "rxjs";

import { History } from 'history';
import { RouterState } from "./state/router-state";
import { State } from "./state/state";
import { StateHistory } from "./state/history";
import { Store } from "./store/store";

export class ReactState {
    static init(domRender: (state: any, history: History) => void, initialState: any, collectHistory: boolean = true, storeHistoryItems: number = 100) {
        const store = new Store(new State(initialState));
        new StateHistory(store, collectHistory, storeHistoryItems).init();
        (<any>window).state = StateHistory;
        const routerHistory = new RouterState(store).init();

        Store.store = store;
        ReactState.initRenderDom(store, domRender, routerHistory);
    }

    private static initRenderDom(store: Store<any>, domRender: (state: any, history: History) => void, routerHistory: History) {
        store.subscribe((state: any) => {
            try {
                domRender(state, routerHistory);
            } catch (exception) {
                console.error(exception);
            }
        });
    }
}