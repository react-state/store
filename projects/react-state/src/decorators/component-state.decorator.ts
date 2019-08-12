import { StateHistory } from '../state/history';
import { Dispatcher } from '../services/dispatcher';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';
import { ReactStateConfig } from '../react-state.config';

export function ComponentState(stateActions: any | ((T: any) => any), updateComponentOnEveryRender: boolean = false) {

    return (target: any) => {

        const componentDidMount = target.prototype.componentDidMount || (() => { });
        const componentWillUnmount = target.prototype.componentWillUnmount || (() => { });
        const shouldComponentUpdate = target.prototype.shouldComponentUpdate || (() => updateComponentOnEveryRender);

        const componentWillMount = function (componentInstance: any, props: { statePath: any, stateIndex: any }) {

            if (ReactStateConfig.isTest) {
                return;
            }

            let statePath = !props.statePath
                ? []
                : props.statePath;

            if (stateActions) {
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
            }
        };

        target.prototype.componentDidMount = function () {
            this.asyncUpdateSubscription = Dispatcher
                .subscribe(this.actions.aId, (state) => {
                    if (state) {
                        this.prevState = state;
                    }

                    this.forceUpdate();
                });

            componentDidMount.call(this);
        };

        target.prototype.shouldComponentUpdate = function (nextProps: any, nextState: any) {
            const currentState = DataStrategyProvider.instance.getIn(StateHistory.instance.currentState, this.statePath);

            const shouldUpdate = this.prevState == null ||
                (DataStrategyProvider.instance.isObject(currentState)
                    ? !DataStrategyProvider.instance.equals(this.prevState, currentState)
                    : this.prevState !== currentState);

            this.prevState = currentState;

            return shouldUpdate
                ? true
                : shouldComponentUpdate.apply(this, arguments);
        };

        target.prototype.componentWillUnmount = function () {
            this.prevState = null;

            if (this.actions) {
                this.actions.onDestroy();
            }

            if (this.asyncUpdateSubscription) {
                this.asyncUpdateSubscription.unsubscribe();
            }

            componentWillUnmount.call(this);
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