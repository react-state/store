import { ReactStateTestBed } from '../src/react-state.test-bed';
import { HasStore, InjectStore } from '../src/decorators/inject-store.decorator';

describe('ReactStateTestBed', () => {

    let component: any;
    const initialState = { todos: [] as any };

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment();
        component = {};
    });

    it('should return actions', () => {
        initialState.todos.push({ description: 'test description' });

        const actions = ReactStateTestBed.createActions(TestActions, initialState, ['todos', 0]) as TestActions;
        expect(actions.todoDescription).toEqual('test description');
    });

    it('should set actions to component', () => {
        initialState.todos.push({ description: 'test description' });

        const actions = ReactStateTestBed.createActions(TestActions, initialState, ['todos', 0]) as TestActions;
        ReactStateTestBed.setActionsToComponent(actions, component);

        expect(component.actions.todoDescription).toEqual('test description');
    });
});

describe('ReactStateTestBed', () => {
    let component: any;

    beforeEach(() => {
        ReactStateTestBed.setTestEnvironment();
        component = {};
    });

    it('should create actions with default state and path', () => {
        const actions = ReactStateTestBed.createActions(TestActions) as TestActions;
        ReactStateTestBed.setActionsToComponent(actions, component);

        (<TestActions>component.actions).todoDescription = 'test';
        expect((<TestActions>component.actions).todoDescription).toEqual('test');
    });
});

@InjectStore([])
export class TestActions extends HasStore<any> {
    get todoDescription() {
        return this.state.get('description');
    }

    set todoDescription(value) {
        this.store.update(state => {
            state.set('description', value);
        });
    }
}