import { StateHistory } from './state/history';
import { ReactStateConfig } from './react-state.config';
import { Store } from './store/store';
import { State } from './state/state';
import { HistoryController } from './state/history-controller';

export class ReactStateTestBed {
    public static setTestEnvironment() {
        ReactStateConfig.isTest = true;
    }

    public static createStore(initialState: any): Store<any> {
        const store = new Store(new State(initialState));
        StateHistory.instance.init(initialState);
        const historyController = new HistoryController(store, { history: { push: () => {}  } as any } as any);
        historyController.init();

        return store;
    }

    public static createActions<T>(actionsType: any, initialState: any = {}, path: string | any[] = []): T {
        Store.store = this.createStore(initialState);

        const actions = new (actionsType as any)();
        actions.createTestStore(ReactStateTestBed.getPath(path));

        return actions;
    }

    public static setActionsToComponent(actions: any, component: any) {
        (<any>component).actions = actions;
    }

    private static getPath(path: string | string[]) {
        if (path instanceof Array) {
            return path;
        }

        path = path.split('/');
        return path;
    }
}