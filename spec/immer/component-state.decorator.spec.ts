import { ComponentState } from '../../projects/react-state/src/decorators/component-state.decorator';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';
import { Subject } from 'rxjs';
import { Dispatcher } from '../../projects/react-state/src/services/dispatcher';

const actionId = 'actionId';
class TestStateActions {
    aId = actionId;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
    store = null;
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

class TargetComponentSecond {
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
    const decorator = ComponentState(TestStateActions);
    const decoratedClass = decorator(TargetComponent);

    let beforeEach = () => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateConfig.isTest = false;
        target = new decoratedClass({ statePath: [] });
        target.actions.store = new Subject();
    };

    it('should resolve stateActions', () => {
        beforeEach();
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should call forceUpdate after state change', () => {
        beforeEach();
        target.componentDidMount();
        jest.spyOn(target, 'forceUpdate');
        target.actions.store.next();

        expect(target.forceUpdate).toHaveBeenCalled();
    });

    it('should call forceUpdate after async value change', () => {
        beforeEach();
        target.componentDidMount();
        jest.spyOn(target, 'forceUpdate');
        Dispatcher.publish(actionId, '');

        expect(target.forceUpdate).toHaveBeenCalled();
    });

    it('should call onDestroy on componentWillUnmount hook', () => {
        beforeEach();
        target.componentDidMount();
        jest.spyOn(target.actions, 'onDestroy');

        target.componentWillUnmount();

        expect(target.actions.onDestroy).toHaveBeenCalled();
    });

    it('should unsubscribe from store componentWillUnmount hook', () => {
        beforeEach();
        target.componentDidMount();
        jest.spyOn(target, 'forceUpdate');

        target.componentWillUnmount();
        target.actions.store.next();

        expect(target.forceUpdate).not.toHaveBeenCalled();
    });
});

describe('ComponentState decorator', () => {
    let target: TargetComponentSecond;
    const decorator = ComponentState(() => TestStateActions);
    const decoratedClass = decorator(TargetComponentSecond);

    let beforeEach = () => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateConfig.isTest = false;
        target = new decoratedClass({ statePath: [] });
        target.actions.store = new Subject();
    };

    it('should resolve stateActions from anonymous function', () => {
        beforeEach();
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });
});