import * as Rx from "rxjs";

import { History } from 'history';
import { RouterState } from "./state/router-state";
import { State } from "./state/state";
import { StateHistory } from "./state/history";
import { Store } from "./store/store";

export class ReactState {
    static init(
        domRender: (history: History) => void,
        initialState: any,
        isProd: boolean = false,
        enableSSR = false,
        collectHistory: boolean = true,
        storeHistoryItems: number = 100
    ) {
        const store = new Store(new State(initialState));
        new StateHistory(store, collectHistory, storeHistoryItems).init(initialState);

        if(!isProd) {
            (<any>window).state = StateHistory;
        }

        const routerHistory = new RouterState(store, enableSSR).init();

        Store.store = store;
        ReactState.initRenderDom(store, domRender, routerHistory);
    }

    private static initRenderDom(store: Store<any>, domRender: (history: History) => void, routerHistory: History) {
        store
            .take(1)
            .subscribe((state: any) => {
                try {
                    domRender(routerHistory);
                } catch (exception) {
                    console.error(exception);
                }
            });
    }
}