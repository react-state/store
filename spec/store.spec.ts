import { State } from '../projects/react-state/src/state/state';
import { StateHistory } from '../projects/react-state/src/state/history';
import { Store } from '../projects/react-state/src/store/store';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ReactStateTestBed } from '../projects/react-state/src/react-state.test-bed';
import { RouterState } from '../projects/react-state/src/state/router-state';

describe('Store tests', () => {
    let store: Store<any>;

    describe('', () => {
        it('should convert initial state classes ES6 to ES5 objects', () => {
            const state = new State(new InitialState()) as BehaviorSubject<InitialState>;
            state
                .pipe(take(1))
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
            store = ReactStateTestBed.createStore(initialState);

            Store.store = store;
        });

        it('should initialize state with initial value', () => {
            store.initialize([], { test: 'test' });

            expect(StateHistory.instance.currentState.get('test')).toEqual('test');
            expect(StateHistory.instance.currentState.get('__initialized')).toEqual(true);
        });

        it('should update state', () => {
            store.select(['layout']).update(state => state.set('loading', true));

            expect(StateHistory.instance.currentState.getIn(['layout', 'loading'])).toEqual(true);
        });

        it('should select state', (done) => {
            store.select(['layout'])
                .pipe(take(1))
                .subscribe((state: any) => {
                    expect(state.get('test')).toBeTruthy();
                    done();
                });
        });

        it('should reset state', () => {
            store.initialize(['router'], { url: 'home' }, false);
            store.select(['layout']).update(state => state.set('loading', true));
            expect(StateHistory.instance.currentState.getIn(['layout', 'loading'])).toEqual(true);

            store.reset();
            expect(StateHistory.instance.currentState.getIn(['layout', 'test'])).toEqual('test');
            expect(StateHistory.instance.currentState.getIn(['layout', 'loading'])).not.toBeDefined();
            expect(StateHistory.instance.currentState.getIn(['router', 'url'])).toBe(RouterState.startingRoute);
        });
    });
});

class InitialState {
    testProp = 'test';
}