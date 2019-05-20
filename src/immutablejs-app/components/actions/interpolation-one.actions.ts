import { HasStore, InjectStore } from './../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Store } from './../../../../projects/react-state/src/store/store';

@InjectStore(['interpolationOne'])
export class InterpolationOneStateActions implements HasStore<any> {

    store: Store<any>;
    state: any;

    get interpolationValue() {
        return this.state.get('value') + '-----<<<<';
    }

    get interpolationValueAsync() {
        return this.store.map(state => this.state.get('value'));
    }

    update(randValue: any) {
        this.store.update(state => {
            state.set('value', randValue);
        });
    }
}