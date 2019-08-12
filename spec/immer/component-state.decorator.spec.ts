import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { Dispatcher, Message } from '../../projects/react-state/src/services/dispatcher';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';
import { StateKeeper } from '../../projects/react-state/src/state/history';

const actionId = 'actionId';
class TestStateActions {
    aId = actionId;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
    onDestroy = () => { };
}

class TargetComponent {
    constructor(props: any) { }
    statePath: string[];
    stateIndex: number | null;
    actions: any;
    props = {};
    componentDidMount() { }
    shouldComponentUpdate() { }
    componentWillUnmount() { }
    forceUpdate() { }
}


describe('ComponentState decorator', () => {
    let target: TargetComponent;

    let beforeEach = (actions?) => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateConfig.isTest = false;
        const decorator = ComponentState(actions);
        const decoratedClass = decorator(TargetComponent);
        target = new decoratedClass({ statePath: [] });
    };

    it('should resolve stateActions', () => {
        beforeEach(TestStateActions);
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should resolve stateActions from anonymous function', () => {
        beforeEach(() => TestStateActions);
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should call forceUpdate after state change', () => {
        beforeEach(TestStateActions);
        target.componentDidMount();
        jest.spyOn(target, 'forceUpdate');

        Dispatcher.publish(new Message(actionId, ''));

        expect(target.forceUpdate).toHaveBeenCalled();
    });

    it('shouldUpdate should return true if state value is different', () => {
        StateKeeper.CURRENT_STATE = { newStatePath: 1 };
        beforeEach(TestStateActions);
        let shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();

        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeFalsy();

        StateKeeper.CURRENT_STATE = StateKeeper.CURRENT_STATE['newStatePath'] = 2;
        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();
    });

    it('shouldUpdate should return true if state object is different', () => {
        StateKeeper.CURRENT_STATE = { newStatePath: { test: 1 } };
        beforeEach(TestStateActions);
        let shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();

        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeFalsy();

        StateKeeper.CURRENT_STATE = StateKeeper.CURRENT_STATE = { newStatePath: { test: 2 } };
        shouldUpdate = target.shouldComponentUpdate();
        expect(shouldUpdate).toBeTruthy();
    });

    it('should call onDestroy on componentWillUnmount hook', () => {
        beforeEach(TestStateActions);
        target.componentDidMount();
        jest.spyOn(target.actions, 'onDestroy');

        target.componentWillUnmount();

        expect(target.actions.onDestroy).toHaveBeenCalled();
    });
});