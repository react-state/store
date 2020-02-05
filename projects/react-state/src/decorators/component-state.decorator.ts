import { ReactStateConfig } from '../react-state.config';
import { ReactStateTestBed } from '../react-state.test-bed';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export function ComponentState(stateActions: any | ((T: any) => any)) {

    return (target: any) => {
        const componentDidMount = target.prototype.componentDidMount || (() => { });
        const componentWillUnmount = target.prototype.componentWillUnmount || (() => { });
        const shouldComponentUpdate = target.prototype.shouldComponentUpdate || (() => false);

        const componentWillMount = function (componentInstance: any, props: { statePath: any, stateIndex: any }) {

            if (ReactStateConfig.isTest) {
                const actions = ReactStateTestBed.getActionsInstance(stateActions, ReactStateTestBed.strictActionsCheck);
                if (actions) {
                    componentInstance.actions = actions.instance;
                    componentInstance.statePath = actions.statePath;
                    return;
                }
            }

            let statePath = !props.statePath
                ? []
                : props.statePath;

            // DOC - CONVETION: only annonymous function allowed for choosing state; Actions can be only named functions;
            const extractedStateAction = stateActions.name === ''
                ? stateActions(componentInstance)
                : stateActions;

            const actions = new extractedStateAction();
            const stateIndex = componentInstance.stateIndex
                ? componentInstance.stateIndex
                : props.stateIndex;

            componentInstance.statePath = actions.createStore(statePath, stateIndex);
            componentInstance.actions = actions;
        };

        target.prototype.componentDidMount = function () {
            this.reactstore__asyncUpdateUnsubscription_ = new Subject();
            this.actions.store
                .pipe(takeUntil(this.reactstore__asyncUpdateUnsubscription_))
                .subscribe(() => {
                    if (ReactStateConfig.isTest && !ReactStateTestBed.useComponentRenderer) {
                        return;
                    }

                    this.forceUpdate();
                });

            componentDidMount.call(this);
        };

        target.prototype.componentWillUnmount = function () {
            this.prevState = null;

            if (this.actions) {
                this.actions.onDestroy();
            }

            this.reactstore__asyncUpdateUnsubscription_.next();
            this.reactstore__asyncUpdateUnsubscription_.unsubscribe();

            componentWillUnmount.call(this);
        };

        target.prototype.shouldComponentUpdate = function () {
            return shouldComponentUpdate.apply(this, arguments);
        };

        return class extends target {
            constructor(...props) {
                super(...props);
                componentWillMount(this, props[0]);
            }
        } as typeof target;
    };
}

export abstract class HasStateActions<T> {
    readonly actions: T = null;
    readonly statePath: any = null;
    readonly stateIndex?: string | number = null;
}