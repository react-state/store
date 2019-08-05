import { StateHistory } from './state/history';
import { ReactStateConfig } from './react-state.config';
import { Store } from './store/store';
import { State } from './state/state';
import { HistoryController } from './state/history-controller';
import { DataStrategy } from '@react-state/data-strategy';
import { DataStrategyProvider } from './data-strategy/data-strategy-provider';
import { RouterState } from './state/router-state';

export class ReactStateTestBed {

    public static setTestEnvironment(dataStrategy: DataStrategy) {
        ReactStateConfig.isTest = true;
        DataStrategyProvider.instance = dataStrategy;
    }

    public static createStore(initialState: any): Store<any> {
        const store = new Store(new State(initialState));
        DataStrategyProvider.instance.init(store, false);
        StateHistory.instance.init(initialState);
        const routerState = new RouterState(store, true);
        const historyController = new HistoryController(store, routerState);

        historyController.init();
        Store.store = store;

        return store;
    }

    public static createActions<T>(actionsType: any, initialState: any = {}, path: string | any[] = []): T {
        this.createStore(initialState);

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