import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { Dispatcher, Message } from '../../projects/react-state/src/services/dispatcher';
import { ImmutableJsDataStrategy } from '../../projects/immutable-data-strategy/src/immutablejs.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';
import { StateKeeper } from '../../projects/react-state/src/state/history';
import { fromJS } from 'immutable';

const actionId = 'actionId';
class TestStateActions {
    aId = actionId;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
}

class TargetComponent {
    statePath: string[];
    stateIndex: number | null;
    actions: any;
    props = {};
    componentWillMount() { }
    componentDidMount() { }
    shouldComponentUpdate() { }
    componentWillUnmount() { }
    forceUpdate() { }
}


describe('ComponentState decorator', () => {
    let target: TargetComponent;

    let beforeEach = function (actions?) {
        ReactStateTestBed.setTestEnvironment(new ImmutableJsDataStrategy());
        ReactStateConfig.isTest = false;
        const decorator = ComponentState(actions);
        decorator(TargetComponent);
        target = new TargetComponent();
    };

    it('should resolve stateActions', () => {
        beforeEach(TestStateActions);
        target.componentWillMount();
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should resolve stateActions from anonymous function', () => {
        beforeEach(() => TestStateActions);
        target.componentWillMount();
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should call forceUpdate after state change', () => {
        beforeEach(TestStateActions);
        target.componentWillMount();
        target.componentDidMount();
        jest.spyOn(target, 'forceUpdate');

        Dispatcher.publish(new Message(actionId, ''));

        expect(target.forceUpdate).toHaveBeenCalled();
    });

    it('shouldUpdate should return true if state value is different', () => {
        StateKeeper.CURRENT_STATE = fromJS({ newStatePath: 1 });
        beforeEach(TestStateActions);
        target.componentWillMount();
        let shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();

        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeFalsy();

        StateKeeper.CURRENT_STATE = StateKeeper.CURRENT_STATE.set('newStatePath', 2);
        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();
    });

    it('shouldUpdate should return true if state object is different', () => {
        StateKeeper.CURRENT_STATE = fromJS({ newStatePath: { test: 1 } });
        beforeEach(TestStateActions);
        target.componentWillMount();
        let shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();

        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeFalsy();

        StateKeeper.CURRENT_STATE = StateKeeper.CURRENT_STATE.setIn(['newStatePath', 'test'], 2);
        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();
    });
});