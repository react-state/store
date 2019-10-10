import { Store } from '../../projects/react-state/src/store/store';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';

describe('State', () => {
    const initialState = {
        arrayTest: [],
        objectTest: { name: '' }
    };

    let store: Store<typeof initialState>;

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        store = ReactStateTestBed.createStore(initialState);
    });

    it('update store', (done) => {
        store.update(state => {
            state.arrayTest.push('hello');
            state.objectTest.name = 'hello';
            expect(state.arrayTest.length).toBe(1);
            expect(state.arrayTest[0]).toBe('hello');
            expect(state.objectTest.name).toEqual('hello');

            done();
        });
    });

    it('initial state should not be affected by previous test', () => {
        expect(initialState.arrayTest.length).toBe(0);
        expect(initialState.objectTest.name).toBe('');
    });
});
