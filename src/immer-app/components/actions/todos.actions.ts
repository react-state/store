import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';
import { TodoModel } from './todo.model';
import { Async } from '../../../../projects/react-state/src/decorators/asyn.decorator';

@InjectStore('todos')
export class TodosStateActions extends HasStore<any> {

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

    @Async()
    get todos(): any {
        return this.store.map(state => state);
    }
}