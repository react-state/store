import { StateHistory } from "../state/history";
import { ReactStateConfig } from '../react-state.config';
import { Dispatcher } from "../services/dispatcher";

export function ComponentState(stateActions: any | ((T: any) => any), updateComponentOnEveryRender: boolean = false) {

    return (target: any) => {

        var componentWillMount = target.prototype.componentWillMount || (() => { });
        var componentDidMount = target.prototype.componentDidMount || (() => { });
        var componentWillUnmount = target.prototype.componentWillUnmount || (() => { });
        var shouldComponentUpdate = target.prototype.shouldComponentUpdate || (() => updateComponentOnEveryRender);

        target.prototype.componentWillMount = function () {

            if (ReactStateConfig.isTest) {
                return;
            }

            this.statePath = !this.props.statePath
                ? []
                : this.props.statePath;

            if (stateActions) {
                // DOC - CONVETION: only annonymous function allowed for choosing state; Actions can be only named functions;
                const extractedStateAction = stateActions.name === ''
                    ? stateActions(this)
                    : stateActions;

                const actions = new extractedStateAction();
                const stateIndex = this.stateIndex
                    ? this.stateIndex
                    : this.props.stateIndex;

                this.statePath = actions.createStore(this.statePath, stateIndex);
                this.actions = actions;
            }

            componentWillMount.call(this);
        }

        target.prototype.componentDidMount = function () {
            this.asyncUpdateSubscription = Dispatcher
                .subscribe(this.actions.aId, (state) => {
                    if (state) {
                        this.prevState = state;
                    }

                    this.forceUpdate();
                });

            componentDidMount.call(this);
        }

        target.prototype.shouldComponentUpdate = function (nextProps: any, nextState: any) {
            const currentState = StateHistory.instance.currentState.getIn(this.statePath);
            const shouldUpdate = this.prevState == null || !this.prevState.equals(currentState);
            this.prevState = currentState;

            return shouldUpdate
                ? true
                : shouldComponentUpdate.apply(this, arguments);
        }

        target.prototype.componentWillUnmount = function () {
            this.prevState = null;

            if (this.actions) {
                this.actions.onDestroy();
                this.actions = null;
            }

            this.statePath = null;

            if (this.asyncUpdateSubscription) {
                this.asyncUpdateSubscription.unsubscribe();
            }

            componentWillUnmount.call(this);
        }
    };
}

export abstract class HasStateActions<T> {
    readonly actions: T = null;
    readonly statePath: any = null;
    readonly stateIndex?: string | number = null;
}