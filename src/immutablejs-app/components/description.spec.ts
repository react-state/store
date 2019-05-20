import { TodoDescription } from './description';
import { TodoModel } from './actions/todo.model';
import { TodoStateActions } from './actions/todo.actions';
import { initialState } from '../../initial-state';
import { ReactStateTestBed } from '../../../projects/react-state/src/react-state.test-bed';

describe('TodoDescription', () => {

    let component: TodoDescription;

    beforeAll(() => {
        ReactStateTestBed.setTestEnvironment();
    });

    beforeEach(() => {
        component = new TodoDescription(null);
    });

    it('should get description', () => {
        initialState.todos.push(<TodoModel>{description: 'test description'});

        const actions = ReactStateTestBed.createActions(TodoStateActions, initialState, ['todos', 0]) as TodoStateActions;
        expect(actions.testTodoDescriptio).toEqual('test description');
    });

    it('should get description from oveeriden constructor', () => {
        const todo = new TodoModel();
        todo.description = 'test description';
        initialState.todos.push(todo);

        const actions = ReactStateTestBed.createActions(TodoStateActions, initialState, ['todos', 0]) as TodoStateActions;
        expect(actions.testTodoDescriptio).toEqual('test description');
    });

    it ('should set actions to component', () => {
        initialState.todos.push(<TodoModel>{description: 'test description'});

        const actions = ReactStateTestBed.createActions(TodoStateActions, initialState, ['todos', 0]) as TodoStateActions;
        ReactStateTestBed.setActionsToComponent(actions, component);
        (<any>component).componentWillMount();
        expect(component.actions.testTodoDescriptio).toEqual('test description');
    });
});