import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Async } from '../../../../projects/react-state/src/decorators/asyn.decorator';

@InjectStore(['${stateIndex}'])
export class TodoStateActions extends HasStore<any> {
    @Async()
    get todoDescription() {
        return this.store.map((state) => {
            return state.description;
        });
    }

    get testTodoDescriptio() {
        return this.state.description;
    }
}