import { Clear, ClearSignature } from './clear';
import * as Rx from 'rxjs';

import { Initialize, InitializeSignature } from './initialize';
import { Select, SelectSignature } from './select';
import { Update, UpdateSignature } from './update';

export class Store<T> extends Rx.Observable<T> implements Rx.Observer<any> {
    static store: Store<any>;
    constructor(state: Rx.Observable<any>) {
        super();

        this.source = state;
    }

    select: SelectSignature = (statePath: any): Store<T> => {
        let selectStore = Select.bind(this).call(this, statePath);
        (<any>selectStore).statePath = statePath;
        return selectStore;
    }

    update: UpdateSignature<T> = Update.bind(this);
    initialize: InitializeSignature<T> = Initialize.bind(this);
    clear: ClearSignature = Clear.bind(this);

    lift<R>(operator: Rx.Operator<T, R>): Store<R> {
        const store = new Store<R>(this);
        store.operator = operator;
        return store;
    }

    error(err: any) {
        console.error(err);
    }

    next(state: any) {
        (<any>this.source).next(state);
    }

    complete() {
    }
}