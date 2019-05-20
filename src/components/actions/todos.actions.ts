import { HasStore, InjectStore } from '../../../projects/react-state/src/decorators/inject-store.decorator';
import { fromJS, List, Map } from 'immutable';
import { Store } from '../../../projects/react-state/src/store/store';
import { TodoModel } from './todo.model';
import { map, delayWhen, delay, throttleTime, debounceTime, startWith } from 'rxjs/operators';
import { timer } from 'rxjs';

@InjectStore('todos')
export class TodosStateActions implements HasStore<any> {

    store: Store<any>;
    state: any;

    addTodo(item: TodoModel) {
        this.store
            .update(state => {
                state.push(fromJS(item));
            }, false, { message: 'Item Added' });
    }

    deleteTodo(index: number) {
        this.store.update(state => {
            state.delete(index);
        }, false);
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