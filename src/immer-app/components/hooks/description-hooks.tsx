import * as React from 'react';

import { TodoStateActions } from '../actions/todo.actions';
import { useComponentState }from '../../../../projects/react-state/src/decorators/component-state.hook';

const TodoDescriptionHooks = ({ statePath, stateIndex }) => {
    const { actions } = useComponentState(TodoStateActions, statePath, stateIndex);

    const interpolationTest = () => {
        return Math.random();
    };

    return (<div>{actions.testTodoDescription} - {interpolationTest()}</div>);
};

export default React.memo(TodoDescriptionHooks);