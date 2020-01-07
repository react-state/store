import * as React from 'react';

import { Dispatcher } from '../../../../projects/react-state/src/services/dispatcher';

import { ClearTodoMessage, UpdateTodoItemMessage } from '../actions/todo.model';
import { InterpolationTwoStateActions } from '../actions/interpolation-two.actions';
import { Store } from '../../../../projects/react-state/src/store/store';
import { useComponentState } from '../../../../projects/react-state/src/decorators/component-state.hook';

const InterpolationTwo = ({ statePath }) => {
    const { actions } = useComponentState(InterpolationTwoStateActions, statePath);

    const test = () => {
        return Math.random();
    };

    const changeState = () => {
        this.actions.update(Math.random());
    };

    const updateDocList = () => {
        Dispatcher.publish(new ClearTodoMessage());
    };

    const updateTodoItem = () => {
        Dispatcher.publish(new UpdateTodoItemMessage());
    };

    const clearState = () => {
        Store.store.reset();
    };

    return (
        <div>{test()} - {actions.interpolationValue}
            <button onClick={() => changeState()}>click</button>
            <button onClick={() => updateDocList()}>clear todos from not related component</button>
            <button onClick={() => updateTodoItem()}>Update first item</button>
            <button onClick={() => clearState()}>Clear State</button>
        </div>
    );
};

export default InterpolationTwo;
