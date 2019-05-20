import * as React from 'react';

import { Dispatcher, Message } from '../../../projects/react-state/src/services/dispatcher';

import { ClearTodoMessage, UpdateTodoItemMessage } from './actions/todo.model';
import { ComponentState } from '../../../projects/react-state/src/decorators/component-state.decorator';
import { InterpolationTwoStateActions } from './actions/interpolation-two.actions';
import { Store } from '../../../projects/react-state/src/store/store';

@ComponentState(InterpolationTwoStateActions)
export class InterpolationOne extends React.Component<any, any> {
    actions: InterpolationTwoStateActions;
    statePath: any;

    render() {
        return (
            <div>{this.test()} - {this.actions.interpolationValue}
                <button onClick={() => this.changeState()}>click</button>
                <button onClick={() => this.updateDocList()}>clear todos from not related component</button>
                <button onClick={() => this.updateTodoItem()}>Update first item</button>
                <button onClick={() => this.clearState()}>Clear State</button>
            </div>);
    }

    test() {
        return Math.random();
    }

    changeState() {
        this.actions.update(Math.random());
    }

    updateDocList() {
        Dispatcher.publish(new ClearTodoMessage());
    }

    updateTodoItem() {
        Dispatcher.publish(new UpdateTodoItemMessage());
    }

    clearState() {
        Store.store.reset();
    }
}