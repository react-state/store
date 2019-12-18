import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Async } from '../../../../projects/react-state/src/decorators/async.decorator';

@InjectStore(['${stateIndex}'])
export class TodoStateActions extends HasStore<any> {
    @Async()
    get todoDescription() {
        return this.store.map((state) => {
            return state.description;
        });
    }

    get testTodoDescription() {
        return this.state.description;
    }
}