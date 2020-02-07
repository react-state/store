import { Map } from 'immutable';
import { HasStore, InjectStore } from '../../../../projects/react-state/src/decorators/inject-store.decorator';
import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { timer, interval, iif, of } from 'rxjs';
import { Async } from '../../../../projects/react-state/src/decorators/async.decorator';

@InjectStore('asyncDemo')
export class AsyncDemoStateActions extends HasStore<Map<any, any>> {

    @Async()
    get progress(): any {
        return this.store.select(['checkbox'])
            .pipe(
                switchMap(state => iif(() => !!state,
                    interval(20).pipe(
                        takeUntil(timer(4000).pipe(
                            tap(_ => {
                                this.store.update(state => {
                                    state.set('disabled', false);
                                });
                            }))
                        )),
                    of(0)
                ))
            );
    }

    @Async()
    get disabled(): any {
        return this.store.map(state => state.get('disabled'));
    }

    reset = () => {
        if (this.state.get('checkbox')) {
            this.store.reset();
        }
    }
}