import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';
import { Store } from '../../../../projects/react-state/src/store/store';
import { TodoModel } from './todo.model';

@InjectStore('todos')
export class TodosStateActions implements HasStore<any> {

    store: Store<any>;
    state: any;

    addTodo(item: TodoModel) {
        this.store
            .update(state => {
                state.push(item);
            }, { message: 'Item Added' });
    }

    deleteTodo(index: number) {
        this.store.update(state => {
            if (index > -1) {
                state.splice(index, 1);
            }

            // delete state[index];
        });
    }

    clearTodos() {
        this.store.reset();
    }

    updateFirstItem() {
        this.store.select(['0']).update(state => {
            state.description = 'updated';
        });
    }

    reset() {
        this.store.reset();
    }

    get todosAsync(): any {
        return this.store.map(state => state);
    }
}