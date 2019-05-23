import { StateHistory } from '../../projects/react-state/src/state/history';
import { Store } from '../../projects/react-state/src/store/store';
import { take } from 'rxjs/operators';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { RouterState } from '../../projects/react-state/src/state/router-state';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';

describe('Store tests', () => {
    let store: Store<any>;

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
    });

    describe('', () => {
        beforeEach(() => {
            const initialState = { layout: { test: 'test' } };
            store = ReactStateTestBed.createStore(initialState);

            Store.store = store;
        });

        it('should initialize state with initial value', () => {
            store.initialize([], { test: 'test' });

            expect(StateHistory.instance.currentState['test']).toEqual('test');
            expect(StateHistory.instance.currentState['__initialized']).toEqual(true);
        });

        it('should update state', () => {
            store.select(['layout']).update(state => state['loading'] = true);

            expect(StateHistory.instance.currentState['layout']['loading']).toEqual(true);
        });

        it('should select state', (done) => {
            store.select(['layout'])
                .pipe(take(1))
                .subscribe((state: any) => {
                    expect(state['test']).toBeTruthy();
                    done();
                });
        });

        it('should reset state', () => {
            store.initialize(['router'], { url: 'home' }, false);
            store.select(['layout']).update(state => state['loading'] = true);
            expect(StateHistory.instance.currentState['layout']['loading']).toEqual(true);

            store.reset();
            expect(StateHistory.instance.currentState['layout']['test']).toEqual('test');
            expect(StateHistory.instance.currentState['layout']['loading']).not.toBeDefined();
            expect(StateHistory.instance.currentState['router']['url']).toBe(RouterState.startingRoute);
        });
    });
});

class InitialState {
    testProp = 'test';
}