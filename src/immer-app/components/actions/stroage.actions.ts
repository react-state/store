import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

@InjectStore(['storage'])
export class StorageStateActions extends HasStore<any> {
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
        this.store.update((state: any) => {
            state.itemToStore = 'changed value';
        });
    }

    get deeperItem() {
        return this.state.itemToStore;
    }
}