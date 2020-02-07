import { Subject, BehaviorSubject } from 'rxjs';
import { InjectStore } from '../../projects/react-state/src/decorators/inject-store.decorator';
import { Async } from '../../projects/react-state/src/decorators/async.decorator';
import { StateKeeper } from '../../projects/react-state/src/state/history';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { Store } from '../../projects/react-state/src/store/store';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';
import { AsyncValueResolver } from '../../projects/react-state/src/helpers/async-value-resolver';
import { Dispatcher } from '../../projects/react-state/src/services/dispatcher';

const asyncValue = new BehaviorSubject<number>(1);

class TestStateActions {
    store: any;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
    get isOpened() {
        return true;
    }

    get isClosed() {
        return asyncValue;
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
        AsyncValueResolver['_instance'] = null;
    });

    let setup = (newPath: string[] | string | ((currentPath, stateIndex) => string[] | string), intialState?: Object | any, debug: boolean = false) => {
        target = new TestStateActions();
        Async()(target, 'isClosed');
        const decorator = InjectStore(newPath, intialState, debug);
        decorator(TestStateActions);

        StateKeeper.CURRENT_STATE = {};
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

    describe('when @Async action', () => {
        beforeEach(() => {
            ReactStateConfig.isProd = true;
        });

        afterEach(() => {
            ReactStateConfig.isProd = false;
        });

        it('should subscribe to observable', () => {
            setup(['test'], null, true);
            target.createStore(['parent']);
            ((target as TestStateActions).isClosed as any);
            expect(Object.keys(AsyncValueResolver.instance['values']).length).toBe(1);
            expect(Object.keys(AsyncValueResolver.instance['subscriptions']).length).toBe(1);
        });

        it('should subscribe serve observable', () => {
            setup(['test'], null, true);
            target.createStore(['parent']);
            let value = ((target as TestStateActions).isClosed as any);
            expect(value).toEqual(1);

            asyncValue.next(2);
            value = ((target as TestStateActions).isClosed as any);
            expect(value).toEqual(2);
        });

        it('should unsubscribe from observable', () => {
            setup(['test'], null, true);
            target.createStore(['parent']);
            ((target as TestStateActions).isClosed as any);

            const subscriptionKeys = Object.keys(AsyncValueResolver.instance['subscriptions']);

            expect(Object.keys(AsyncValueResolver.instance['values']).length).toBe(1);
            expect(subscriptionKeys.length).toBe(1);

            const firstSubscription = AsyncValueResolver.instance['subscriptions'][subscriptionKeys[0]];
            spyOn(firstSubscription, 'unsubscribe');
            (target as any).onDestroy();

            expect(Object.keys(AsyncValueResolver.instance['values']).length).toBe(0);
            expect(Object.keys(AsyncValueResolver.instance['subscriptions']).length).toBe(0);
            expect(firstSubscription.unsubscribe).toHaveBeenCalled();
        });

        it('should dispatch message about value change', () => {
            setup(['test'], null, true);
            target.createStore(['parent']);
            spyOn(Dispatcher, 'publish');

            asyncValue.next(2);
             ((target as TestStateActions).isClosed as any);
            expect(Dispatcher.publish).toHaveBeenCalled();
        });
    });
});