import { Cursor } from './cursor';
import { tap, take } from 'rxjs/operators';
import { StateHistory } from '../state/history';
import { ActionType } from './debug-info-data';

export class Update {
    constructor(action: (state: any) => void, wrapToWithMutations: boolean = true, debugMessage: string = null) {
        let updated = false;
        let actionWrapper = function () {
            if (updated) {
                return;
            }

            const cursor = Cursor.bind(this).call(this);

            updated = true;
            try {
                if (wrapToWithMutations) {
                    cursor.withMutations((state: any) => {
                        action(state);
                    });
                } else {
                    action(cursor);
                }
            } catch (exception) {
                console.error(exception);
            }

        }.bind(this);

        StateHistory.debugInfo = {
            message: debugMessage,
            actionType: ActionType.Update,
            statePath: (<any>this).statePath
        };

        (<any>this).pipe(
            tap(actionWrapper),
            take(1)
        ).subscribe();
    }
}

export interface UpdateSignature<T> {
    (action: (state: T) => void, wrapToWithMutations?: boolean, debugMessage?: string): void;
}