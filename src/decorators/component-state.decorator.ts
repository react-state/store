import * as Immutabtle from 'immutable';

import { StateHistory } from "../state/history";
import { unsubscribe } from "../helpers/async-filter"

export function ComponentState(stateActions: any | ((T: any) => any), updateComponentOnEveryRender: boolean = false) {

    return (target: any) => {

        var componentWillMount = target.prototype.componentWillMount || (() => { });
        var componentWillUnmount = target.prototype.componentWillUnmount || (() => { });
        var shouldComponentUpdate = target.prototype.shouldComponentUpdate || (() => updateComponentOnEveryRender);
        var prevState: Immutabtle.Map<any, any> = null;

        target.prototype.componentWillMount = function () {
            this.statePath = !this.props.statePath
                ? []
                : this.props.statePath;

            if (stateActions) {
                // DOC - CONVETION: only annonymous function allwed for choosing state; Actions can be only named functions;
                const extractedStateAction = stateActions.name === ''
                    ? stateActions(this)
                    : stateActions;

                const initState = new extractedStateAction();
                this.statePath = initState.createStore(initState, this.statePath, this.props.stateIndex);
                this.actions = initState;

                this.subscribtion = initState.store
                    .subscribe((state: any)=> {
                        prevState = state;
                        this.forceUpdate();
                    });
            }

            componentWillMount.call(this);
        }

        target.prototype.shouldComponentUpdate = function (nextProps: any, nextState: any) {
            const currentState = StateHistory.CURRENT_STATE.getIn(this.statePath);
            const shouldUpdate = prevState === null || !prevState.equals(currentState);
            prevState = currentState;

            return shouldUpdate
                ? true
                : shouldComponentUpdate.apply(this, arguments)
        }

        target.prototype.componentWillUnmount = function() {
            const observableIds = this.actions.getAllObservableIds(this.actions);
            unsubscribe(observableIds);
            this.subscribtion.unsubscribe();
            componentWillMount.call(this);
        }
    };
}

export interface IComponentStateActions<T> {
    actions: T;
}