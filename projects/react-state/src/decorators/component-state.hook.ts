import * as React from 'react';
import { ReactStateConfig } from '../react-state.config';
import { ReactStateTestBed } from '../react-state.test-bed';
import { Subject } from 'rxjs';
import { HasStore, ActionInjector } from './inject-store.decorator';
import { takeUntil } from 'rxjs/operators';

function useForceUpdate() {
    const [, setTick] = React.useState(0);
    const update = React.useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

const useComponentState = <T>(stateActions: new () => HasStore<T>, statePath: string | any[] = [], stateIndex: string | number = null) => {
    const actions = React.useRef(null);
    const sp = React.useRef(null);

    const unsubscriber = new Subject();
    const forceUpdate = useForceUpdate();

    const componentWillUnmount = () => {
        if (actions.current) {
            (actions.current as any).onDestroy();
        }

        unsubscriber.next();
        unsubscriber.unsubscribe();
    };

    const createActions = () => {
        if (ReactStateConfig.isTest) {
            const actionsInstance = ReactStateTestBed.getActionsInstance(stateActions, ReactStateTestBed.strictActionsCheck);
            if (actionsInstance) {
                actions.current = actionsInstance;
                sp.current = actionsInstance.statePath;
                return;
            }
        }

        const actionsInstance = new stateActions() as ActionInjector<T>;

        sp.current = actionsInstance.createStore(statePath, stateIndex);
        actions.current = actionsInstance;
    };

    if (!actions.current) {
        createActions();
    }

    React.useEffect(() => {
        actions.current.store
            .pipe(takeUntil(unsubscriber))
            .subscribe(() => {
                forceUpdate();
            });

        return () => {
            componentWillUnmount();
        };
    }, []);

    return { actions: actions.current as never as T, statePath: sp.current };
};

export = useComponentState;