import { History } from 'history';
import { Store } from "../store/store";
import { createBrowserHistory, createMemoryHistory } from 'history';

export class RouterState {
    history: History;
    currentRoute: string;

    constructor(private store: Store<any>, serverSideRenderingEnabled: boolean) {
        this.history = serverSideRenderingEnabled
            ? createMemoryHistory()
            : createBrowserHistory();
    }

    init() {
        this.initRouter();
        this.bindRouter();

        return this;
    }

    private initRouter() {
        this.store.initialize(['router'], { url: '/' }, false);
        this.currentRoute = '/';
    }

    private bindRouter() {
        this.history.listen((location: any, action: any) => {
            this.currentRoute = location.pathname;
            (<Store<any>>this.store.select(['router'])).update(state => {
                state.set('url', location.pathname);
            });
        });
    }
}