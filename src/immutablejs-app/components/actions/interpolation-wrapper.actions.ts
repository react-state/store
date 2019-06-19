import { HasStore, InjectStore } from './../../../../projects/react-state/src/decorators/inject-store.decorator';

import { Store } from './../../../../projects/react-state/src/store/store';

@InjectStore('interpolationTest')
export class InterpolationTestStateActions extends HasStore<any> {
}