import { TodoDescription } from './description';
import { TodoModel } from './actions/todo.model';
import { TodoStateActions } from './actions/todo.actions';
import { initialState } from '../../initial-state';
import { ReactStateTestBed } from '../../../projects/react-state/src/react-state.test-bed';
import { ImmerDataStrategy } from '../../../projects/immer-data-strategy//src/immer.data-strategy';

describe('TodoDescription', () => {

    let component: TodoDescription;
    let copyIntitialState: typeof initialState;

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment(new ImmerDataStrategy());
        ReactStateTestBed.strictActionsCheck = false;

        copyIntitialState = JSON.parse(JSON.stringify(initialState));
        copyIntitialState.todos.push(<TodoModel>{ description: 'test description' });
        ReactStateTestBed.createActions(TodoStateActions, copyIntitialState, ['todos', 0]) as TodoStateActions;
        component = new TodoDescription(null);
    });

    it('should get description', () => {
        expect(component.actions.testTodoDescription).toEqual('test description');
    });

    it('should get description from oveeriden constructor', () => {
        expect(component.actions.testTodoDescription).toEqual('test description');
    });

    it('should set explicite actions to component', () => {
        copyIntitialState.todos.push(<TodoModel>{ description: 'test description 2' });

        const actions = ReactStateTestBed.createActions(TodoStateActions, copyIntitialState, ['todos', 1]) as TodoStateActions;
        ReactStateTestBed.setActionsToComponent(actions, component);
        expect(component.actions.testTodoDescription).toEqual('test description 2');
    });
});
