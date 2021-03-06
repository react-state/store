import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Store } from '../../../../projects/react-state/src/store/store';

@InjectStore(['interpolationOne'])
export class InterpolationOneStateActions extends HasStore<any> {
    get interpolationValue() {
        return this.state.value + '-----<<<<';
    }

    get interpolationValueAsync() {
        return this.store.map(state => this.state.value);
    }

    update(randValue: any) {
        this.store.update(state => {
            state.value = randValue;
        });
    }
}