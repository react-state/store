import { ReactStateTestBed } from '../src/react-state.test-bed';
import { HasStore, InjectStore } from '../src/decorators/inject-store.decorator';

describe('NgStateTestBed', () => {

    let component: any;
    const initialState = { todos: [] } as any;

    beforeAll(() => {
        ReactStateTestBed.setTestEnvironment();
    });

    beforeEach(() => {
        component = {};
    });

    it('should return actions', () => {
        initialState.todos.push({ description: 'test description' });

        const actions = ReactStateTestBed.createActions(initialState, ['todos', 0], TestActions) as TestActions;
        expect(actions.todoDescription).toEqual('test description');
    });

    it('should set actions to component', () => {
        initialState.todos.push({ description: 'test description' });

        const actions = ReactStateTestBed.createActions(initialState, ['todos', 0], TestActions) as TestActions;
        ReactStateTestBed.setActionsToComponent(actions, component);

        expect(component.actions.todoDescription).toEqual('test description');
    });
});

@InjectStore([])
export class TestActions extends HasStore<any> {
    get todoDescription() {
        return this.state.get('description');
    }
}