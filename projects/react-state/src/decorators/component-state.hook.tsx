import * as React from 'react';
import { ReactStateConfig } from '../react-state.config';
import { ReactStateTestBed } from '../react-state.test-bed';
import { Subject } from 'rxjs';
import { HasStore } from './inject-store.decorator';
import { takeUntil } from 'rxjs/operators';

export function useForceUpdate() {
    const [, setTick] = React.useState(0);
    const update = React.useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

const connect = (stateActions: any | ((T: any) => any), Component: any) => {
    let actions: HasStore<any>;
    let statePath: any;

    return (props: any) => {

        const unsubscriber = new Subject();
        const forceUpdate = useForceUpdate();

        const componentWillUnmount = () => {
            if (actions) {
                (actions as any).onDestroy();
            }

            unsubscriber.next();
            unsubscriber.unsubscribe();
        };

        const createActions = () => {
            if (actions) {
                return;
            }

            if (ReactStateConfig.isTest) {
                const actionsInstance = ReactStateTestBed.getActionsInstance(stateActions, ReactStateTestBed.strictActionsCheck);
                if (actionsInstance) {
                    actions = actionsInstance.instance;
                    statePath = actionsInstance.statePath;
                    return;
                }
            }

            let parentStatePath = !props.statePath ? [] : props.statePath;
            const actionsInstance = new stateActions();

            statePath = actionsInstance.createStore(parentStatePath, props.stateIndex);
            actions = actionsInstance;
        };

        createActions();

        React.useEffect(() => {
            actions.store
                .pipe(takeUntil(unsubscriber))
                .subscribe(() => forceUpdate());

            return () => {
                componentWillUnmount();
            };
        }, []);

        return (
            <div>
                {console.log(Math.random())}
                <Component actions={actions} statePath={statePath} {...props} />
            </div>
        );
    };
};

export default connect;