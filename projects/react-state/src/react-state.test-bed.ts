import { StateHistory } from './state/history';
import { ReactStateConfig } from './react-state.config';
import { Store } from './store/store';
import { State } from './state/state';
import { HistoryController } from './state/history-controller';
import { DataStrategy } from '@react-state/data-strategy';
import { DataStrategyProvider } from './data-strategy/data-strategy-provider';
import { RouterState } from './state/router-state';
import { Helpers } from './helpers/helpers';

export class ReactStateTestBed {

    private static actions: TestComponentActions[] = [];

    public static strictActionsCheck = true;

    public static getActionsInstance(actionsType: any, strictActionsCheck: boolean = true) {
        const componentActions = ReactStateTestBed.actions.find(c => c.actionsType === actionsType);
        if (componentActions) {
            return componentActions.instance;
        } else if (strictActionsCheck) {
            throw new Error(`No actions were found for ${actionsType}`);
        } else {
            return null;
        }
    }

    public static setTestEnvironment(dataStrategy: DataStrategy) {
        ReactStateConfig.isTest = true;
        DataStrategyProvider.instance = dataStrategy;
        ReactStateTestBed.actions = [];
        ReactStateTestBed.strictActionsCheck = true;
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
        actions.aId = Helpers.guid();
        actions.createTestStore(ReactStateTestBed.getPath(path));

        if (!ReactStateTestBed.getActionsInstance(actionsType, false)) {
            ReactStateTestBed.actions.push({ actionsType, instance: actions });
        }

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

export interface TestComponentActions {
    actionsType: any;
    instance: any;
}