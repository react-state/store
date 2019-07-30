import { Store } from '../../projects/react-state/src/store/store';
import { StateHistory } from '../../projects/react-state/src/state/history';
import { ImmutableJsDataStrategy, ImmutableUpdateActionAdditionalSettings } from '../../projects/immutable-data-strategy/src/immutablejs.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { OptimistaicUpdatesManager } from '../../projects/react-state/src/store/plugins/optimistic-updates.plugin';

describe('Optimistic updates - Immutable', () => {
    let store: Store<any>;
    let stateHistory: StateHistory;

    const dataStrategy = new ImmutableJsDataStrategy();

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment(dataStrategy);
        const initialState = {
            layout: { test: 'test' },
            counter: 1
        };
        store = ReactStateTestBed.createStore(initialState);
        stateHistory = StateHistory.instance;
        stateHistory.history = [];
        store.select(['layout']).update(state => state.set('test', 'test2'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should add tag on history', () => {
        store.optimisticUpdates.tagCurrentState('testTag');
        expect(stateHistory.history[0].tag).toEqual('testTag');
    });

    it('should revert to tag on root level', () => {
        store.select(['layout']).update(state => state.set('test', 'test5'));
        store.optimisticUpdates.tagCurrentState('testTag');

        store.select(['layout']).update(state => state.set('test', 'test3'));
        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test3');

        store.optimisticUpdates.revertToTag('testTag');

        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test5');
        expect(stateHistory.history.length).toBe(2);
        expect(stateHistory.history[1].state.getIn(['layout', 'test'])).toEqual('test5');
    });

    it('should revert to tag on nested level', () => {
        store.optimisticUpdates.tagCurrentState('testTag');
        store.update(state => {
            state.setIn(['layout', 'test'], 'test3');
            state.set('counter', 2);
        }, {}, { withMutations: true } as ImmutableUpdateActionAdditionalSettings);

        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test3');
        expect(stateHistory.currentState.get('counter')).toEqual(2);

        store.select(['layout']).optimisticUpdates.revertToTag('testTag');
        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test2');
        expect(stateHistory.currentState.get('counter')).toEqual(2);

    });

    it('should revert to last tag', () => {
        store.optimisticUpdates.tagCurrentState('testTag');
        store.select(['layout']).update(state => state.set('test', 'test3'));
        store.optimisticUpdates.tagCurrentState('testTag2');
        store.select(['layout']).update(state => state.set('test', 'test4'));

        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test4');

        store.optimisticUpdates.revertToLastTag();
        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test3');
    });

    it('should revert last N actions', () => {
        store.select(['layout']).update(state => state.set('test', 'test3'));
        store.select(['layout']).update(state => state.set('test', 'test4'));
        store.select(['layout']).update(state => state.set('test', 'test5'));

        store.optimisticUpdates.revertLastChanges(2);
        expect(stateHistory.currentState.getIn(['layout', 'test'])).toEqual('test3');
    });

    describe('should throw an error when no history item found', () => {
        it('on reverting to non existing index', () => {
            const stepsBack = 2;
            expect(() => store.optimisticUpdates.revertLastChanges(stepsBack))
            .toThrowError(OptimistaicUpdatesManager.nonExistingChangeMessage(stepsBack));
        });

        it('on reverting to non existing tag', () => {
            const tag = 'testTagNonExisting';
            expect(() => store.optimisticUpdates.revertToTag(tag))
            .toThrowError(OptimistaicUpdatesManager.nonExistingTagMessage(tag));
        });

        it('on reverting to non existing tag when there are no tags at all', () => {
            expect(() => store.optimisticUpdates.revertToLastTag())
            .toThrowError(OptimistaicUpdatesManager.nonTagsMessage);
        });
    });
});
