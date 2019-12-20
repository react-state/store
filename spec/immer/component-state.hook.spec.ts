import * as React from 'react';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';
import { ReactStateTestBed } from '../../projects/react-state/src/react-state.test-bed';
import { ReactStateConfig } from '../../projects/react-state/src/react-state.config';
import useComponentState = require('../../projects/react-state/src/decorators/component-state.hook');
import { HasStore } from '../../projects/react-state/src/decorators/inject-store.decorator';
import { Subject } from 'rxjs';

const actionId = 'actionId';
class TestStateActions extends HasStore<any> {
    aId = actionId;
    createStore(statePath: string[], stateIndex: number | null) {
        return ['newStatePath'];
    }
    store = new Subject() as any;
    onDestroy = () => { };
}

describe('ComponentState Hook', () => {
    let target: { actions: TestStateActions, statePath: any[] };
    const useEffect = jest.spyOn(React, 'useEffect');
    let unmount: any;
    const mockUseEffect = () => {
        useEffect.mockImplementation(f => {
            unmount = f();
        });
    };

    const forceUpdate = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(React, 'useRef').mockImplementation(() => ({ current: null }));
        jest.spyOn(React, 'useState').mockImplementation(() => [0, forceUpdate]);
        jest.spyOn(React, 'useCallback').mockImplementation(() => forceUpdate);
        mockUseEffect();
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateConfig.isTest = false;
        target = useComponentState(TestStateActions, []);
    });

    it('should resolve stateActions', () => {
        expect(target.statePath[0]).toBe('newStatePath');
        expect(target.actions instanceof TestStateActions).toBeTruthy();
    });

    it('should call forceUpdate after state change', () => {
        target.actions.store.next();

        expect(forceUpdate.mock.calls.length).toBe(1);
        expect(React.useState).toHaveBeenCalled();
    });

    it('should call onDestroy on componentWillUnmount hook', () => {
        jest.spyOn(target.actions, 'onDestroy');
        unmount();

        expect(target.actions.onDestroy).toHaveBeenCalled();
    });

    it('should unsubscribe from store componentWillUnmount hook', () => {
        unmount();
        target.actions.store.next();

        expect(forceUpdate.mock.calls.length).toBe(0);
    });
});