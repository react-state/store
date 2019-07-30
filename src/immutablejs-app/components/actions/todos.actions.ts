import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';
import { fromJS, List } from 'immutable';
import { TodoModel } from './todo.model';
import * as _Cursor from 'immutable/contrib/cursor';
import { ImmutableUpdateActionAdditionalSettings } from '../../../../projects/immutable-data-strategy';
import { Async } from '../../../../projects/react-state/src/decorators/asyn.decorator';

@InjectStore('todos')
export class TodosStateActions extends HasStore<any> {

    addTodo(item: TodoModel) {
        this.store
            .update(state => {
                state.push(fromJS(item));
            }, { message: 'Item Added' });
    }

    deleteTodo(index: number) {
        this.store.update((state: List<any>) => {
            state.delete(index);
        }); // , {}, { withMutations: true } as ImmutableUpdateActionAdditionalSettings
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

    @Async()
    get todos(): any {
        return this.store.map(state => state.toArray());
    }
}