import * as Immutabtle from 'immutable';

import { StateHistory } from "../state/history";
import { unsubscribe } from "../helpers/async-filter"
import { ReactStateConfig } from '../react-state.config';

export function ComponentState(stateActions: any | ((T: any) => any), updateComponentOnEveryRender: boolean = false) {

    return (target: any) => {

        var componentWillMount = target.prototype.componentWillMount || (() => { });
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
                // DOC - CONVETION: only annonymous function allwed for choosing state; Actions can be only named functions;
                const extractedStateAction = stateActions.name === ''
                    ? stateActions(this)
                    : stateActions;

                const initState = new extractedStateAction();
                const stateIndex = this.stateIndex
                    ? this.stateIndex
                    : this.props.stateIndex;

                this.statePath = initState.createStore(this.statePath, stateIndex, (state: any) => {
                    this.prevState = state;
                    this.forceUpdate();
                });

                this.actions = initState;
            }

            componentWillMount.call(this);
        }

        target.prototype.shouldComponentUpdate = function (nextProps: any, nextState: any) {
            const currentState = StateHistory.CURRENT_STATE.getIn(this.statePath);
            const shouldUpdate = this.prevState == null || !this.prevState.equals(currentState);
            this.prevState = currentState;

            return shouldUpdate
                ? true
                : shouldComponentUpdate.apply(this, arguments)
        }

        target.prototype.componentWillUnmount = function () {
            this.prevState = null;
            const observableIds = this.actions.getAllObservableIds();
            unsubscribe(observableIds);

            if (this.actions) {
                this.actions.onDestroy();
            }

            componentWillMount.call(this);
        }
    };
}

export abstract class HasStateActions<T> {
    readonly actions: T = null;
    readonly statePath: any = null;
    readonly stateIndex?: string | number = null;
}