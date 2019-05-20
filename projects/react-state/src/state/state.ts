import { BehaviorSubject } from 'rxjs';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class State<T> extends BehaviorSubject<T> {
    constructor(initialState: T) {
        DataStrategyProvider.instance.overrideContructor(initialState);
        super(DataStrategyProvider.instance.fromJS(initialState));
    }
}