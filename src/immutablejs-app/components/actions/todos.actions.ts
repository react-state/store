import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';
import { fromJS } from 'immutable';
import { Store } from '../../../../projects/react-state/src/store/store';
import { TodoModel } from './todo.model';

@InjectStore('todos')
export class TodosStateActions extends HasStore<any> {

    addTodo(item: TodoModel) {
        this.store
            .update(state => {
                state.push(fromJS(item));
            }, { message: 'Item Added' });
    }

    deleteTodo(index: number) {
        this.store.update(state => {
            state.delete(index);
        });
    }

    clearTodos() {
        this.store.reset();
    }

    updateFirstItem() {
        this.store.select(['0']).update(state => {
            state.set('description', 'updated');
        });
    }

    reset() {
        this.store.reset();
    }

    get todosAsync(): any {
        return this.store.map(state => state.toArray());
    }
}