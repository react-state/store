import { History } from 'history';
import { Store } from "../store/store";
import { createBrowserHistory, createMemoryHistory } from 'history';

export class RouterState {
    history: History;

    constructor(private store: Store<any>, serverSideRenderingEnabled: boolean) {
        this.history = serverSideRenderingEnabled
            ? createMemoryHistory()
            : createBrowserHistory();
    }

    init() {
        this.initRouter();
        this.bindRouter();

        return this.history;
    }

    private initRouter() {
        this.store.initialize(['router'], { url: '/' }, false);
    }

    private bindRouter() {
        this.history.listen((location: any, action: any) => {
            (<Store<any>>this.store.select(['router'])).update(state => {
                state.set('url', location.pathname);
            });
        });
    }
}