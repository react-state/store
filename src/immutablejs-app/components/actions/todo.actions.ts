import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Store } from '../../../../projects/react-state/src/store/store';

@InjectStore(['${stateIndex}'])
export class TodoStateActions extends HasStore<any> {

    get todoDescriptionAsync() {
        return this.store.map((state) => {
            return state.get('description');
        });
    }

    get testTodoDescriptio() {
        return this.state.get('description');
    }
}