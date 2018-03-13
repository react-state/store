import { State } from './../src/state/state';
import { StateHistory } from './../src/state/history';
import { Store } from './../src/store/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

describe('Store tests', () => {
    let store: Store<any>;

    describe('', () => {
        it('should convert initial state classes ES6 to ES5 objects', () => {
            const state = new State(new InitialState()) as BehaviorSubject<InitialState>;
            state
                .take(1)
                .subscribe((value: any) => {
                    const obj = value.toJS();
                    expect(obj.testProp).toBeDefined();
                    expect(obj.testProp).toEqual('test');
                    expect(value.testProp).not.toBeDefined();
                });
        });
    });

    describe('', () => {
        beforeEach(() => {
            const initialState = { layout: { test: 'test' } };
            store = new Store(new State(initialState));
            const history = new StateHistory(store, false, null).init(initialState);

            Store.store = store;
        });

        it('should initialize state with initial value', () => {
            store.initialize([], { test: 'test' });

            expect(StateHistory.CURRENT_STATE.get('test')).toEqual('test');
            expect(StateHistory.CURRENT_STATE.get('__initialized')).toEqual(true);
        });

        it('should update state', () => {
            store.select(['layout']).update(state => state.set('loading', true));

            expect(StateHistory.CURRENT_STATE.getIn(['layout', 'loading'])).toEqual(true);
        });

        it('should select state', (done) => {
            store.select(['layout'])
                .take(1)
                .subscribe((state: any) => {
                    expect(state.get('test')).toBeTruthy();
                    done();
                });
        });

        it('should clear state', () => {
            store.initialize(['router'], { url: 'home' }, false);
            store.select(['layout']).update(state => state.set('loading', true));
            expect(StateHistory.CURRENT_STATE.getIn(['layout', 'loading'])).toEqual(true);

            store.clear();
            expect(StateHistory.CURRENT_STATE.getIn(['layout', 'test'])).toEqual('test');
            expect(StateHistory.CURRENT_STATE.getIn(['layout', 'loading'])).not.toBeDefined();
            expect(StateHistory.CURRENT_STATE.getIn(['router', 'url'])).toBe('');
        });
    });
});

class InitialState {
    testProp = 'test';
}