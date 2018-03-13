import * as Immutable from 'immutable';
import * as Rx from 'rxjs';
import { Helpers } from '../helpers/helpers';

export class State<T> extends Rx.BehaviorSubject<T> {
  constructor(initialState: T) {
    Helpers.overrideContructor(initialState);
    super(Immutable.fromJS(initialState));
  }
}