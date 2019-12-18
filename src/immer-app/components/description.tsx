import * as React from 'react';

import { ComponentState, HasStateActions } from '../../../projects/react-state/src/decorators/component-state.decorator';
import { TodoStateActions } from './actions/todo.actions';

@ComponentState(TodoStateActions)
export class TodoDescription extends React.Component<any, any> implements HasStateActions<TodoStateActions> {
    actions: TodoStateActions;
    statePath: any;

    render() {
        return <div>{this.actions.testTodoDescription} - {this.interpolationTest()}</div>;
    }

    interpolationTest() {
        return Math.random();
    }
}