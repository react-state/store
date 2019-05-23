import { Subject } from 'rxjs';
import { fromJS } from 'immutable';
import { InjectStore } from '../../projects/react-state/src/decorators/inject-store.decorator';
import { StateKeeper } from '../../projects/react-state/src/state/history';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { Store } from '../../projects/react-state/src/store/store';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';

class TestStateActions {
    store: any;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
    get isOpened() {
        return true;
    }
}

const store = {
    initialize: (statePath, intialState) => { },
    select: (statePath: string[]) => new Subject()
};

describe('InjectStore decorator', () => {
    let target;
    let componentInstance = {};

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        Store.store = store as any;
    });

    let setup = (newPath: string[] | string | ((currentPath, stateIndex) => string[] | string), intialState?: Object | any, debug: boolean = false) => {
        const decorator = InjectStore(newPath, intialState, debug);
        decorator(TestStateActions);
        target = new TestStateActions();
        StateKeeper.CURRENT_STATE = fromJS({});
        spyOn(StateKeeper.CURRENT_STATE, 'getIn').and.returnValue(true);

    };

    it('should resolve state path from anonymous function', () => {
        setup((currentPath, stateIndex) => 'new path');
        const newPath = target.createStore();

        expect(newPath.length).toEqual(1);
        expect(newPath[0]).toBe('new path');
    });

    it('should extract absolute path', () => {
        setup('new/${stateIndex}/path/${stateIndex}');
        const newPath = target.createStore(null, [1, 2]);

        expect(newPath.length).toEqual(4);
        expect(newPath[0]).toBe('new');
        expect(newPath[1]).toBe(1);
        expect(newPath[2]).toBe('path');
        expect(newPath[3]).toBe(2);
    });

    it('should extract relative path', () => {
        setup(['test', '${stateIndex}', 'path']);
        const newPath = target.createStore(['parent'], 1);

        expect(newPath.length).toEqual(4);
        expect(newPath[0]).toBe('parent');
        expect(newPath[1]).toBe('test');
        expect(newPath[2]).toBe(1);
        expect(newPath[3]).toBe('path');
    });

    it('should create store', () => {
        setup(['test', '${stateIndex}', 'path']);
        target.createStore(['parent'], 1);

        expect(target.store).toBeDefined();
    });

    it('should initialize store with initial values if provided', () => {
        setup(['test', '${stateIndex}', 'path'], { test: 'test' });
        target.store = store;
        spyOn(store, 'initialize').and.returnValue(new Subject<any>());

        target.createStore(['parent'], 1);

        expect(store.initialize).toHaveBeenCalled();
    });

    it('should convert getters to properties', () => {
        setup((currentPath, stateIndex) => 'new path');
        componentInstance = target;

        expect(typeof (<any>componentInstance).isOpened).toEqual('boolean');
    });

    it('should check path', () => {
        spyOn(console, 'error');
        ReactStateConfig.isTest = false;
        setup(['test']);
        target.createStore(['parent']);
        expect(console.error).toHaveBeenCalled();
        ReactStateConfig.isTest = true;
    });

    it('should check path if debug is set', () => {
        spyOn(console, 'error');
        setup(['test'], null, true);
        target.createStore(['parent']);
        expect(console.error).toHaveBeenCalled();
    });

    it('should not check path for prod', () => {
        ReactStateConfig.isProd = true;
        spyOn(console, 'error');
        setup(['test'], null, true);
        target.createStore(['parent']);
        expect(console.error).not.toHaveBeenCalled();
        ReactStateConfig.isProd = false;
    });
});