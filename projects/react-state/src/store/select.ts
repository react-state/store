import { Store } from './store';
import { map, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class Select {
    constructor(path: any) {
        let mapped$;

        if (typeof path === 'object') {
            mapped$ = (<any>this).pipe(
                map((state: any) => DataStrategyProvider.instance.getIn(state, path)),
                takeWhile((state: any) => state !== undefined),
                distinctUntilChanged()
            );
        }
        else {
            throw new TypeError(`Unexpected type ${typeof path} in select operator,`
                + ` expected 'object' or 'function'`);
        }

        return mapped$;
    }
}

export interface SelectSignature {
  (path: string[]): Store<any>;
}