import { History } from 'history';
import { Store } from '../store/store';
import { createBrowserHistory, createMemoryHistory } from 'history';

export class RouterState {
    static startingRoute = '/';

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
        this.store.initialize(['router'], { url: RouterState.startingRoute }, false);
        this.currentRoute = RouterState.startingRoute;
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