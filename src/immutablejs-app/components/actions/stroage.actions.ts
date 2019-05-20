import { Map } from 'immutable';
import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

@InjectStore(['storage'])
export class StorageStateActions extends HasStore<Map<any, any>> {
    add() {
        return this.store.storage.save();
    }

    remove() {
        return this.store.storage.remove();
    }

    clear() {
        return this.store.storage.clear();
    }

    load() {
        return this.store.storage.load();
    }

    change() {
        this.store.update((state: Map<any, any>) => {
            state.set('itemToStore', 'changed value');
        });
    }

    get deeperItem() {
        return this.state.get('itemToStore');
    }
}