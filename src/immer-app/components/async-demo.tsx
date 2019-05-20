import * as React from 'react';
import { AsyncDemoStateActions } from './actions/async-demo.actions';
import { ComponentState } from '../../../projects/react-state/src/decorators/component-state.decorator';
import { ReactComponentWithStateActions } from '../../../projects/react-state/src/react-component-with-state-actions';
import { Store } from '../../../projects/react-state/src/store/store';
import { FormStateManager } from '../../../projects/react-state/src/store/plugins/form-manager.plugin';
import { Subject } from 'rxjs';

@ComponentState(AsyncDemoStateActions)
export class AsyncDemo extends ReactComponentWithStateActions<any, any, AsyncDemoStateActions> {
    private form = React.createRef<HTMLFormElement>();
    private formStateManager: FormStateManager;
    private unsubscribe = new Subject<any>();

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {

        this.formStateManager = Store.store.select(['asyncDemo']).form
            .bind(this.form.current)
            .sync();
    }

    componentWillUnmount() {
        this.formStateManager.destroy();
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

    render() {
        return (
            <div>
                <div style={{ width: '400px' }}>
                    <form ref={this.form}>
                        <section>
                            <h6>Async Action Demo</h6>
                            <div className='form-check'>
                                <input className='form-check-input' id='new' type='checkbox' name='checkbox' onClick={this.actions.reset} />
                                <label className='form-check-label' htmlFor='new'>Enable Input Field</label>
                            </div>
                            <div className='form-group' style={{position: 'relative'}}>
                                <div style={{
                                    position: 'absolute',
                                    width: (this.actions.progressAsync * 2) + 'px',
                                    height: '2px',
                                    backgroundColor: '#007bff'
                                    }}></div>
                            </div>
                            <div className='form-group'>
                                <input className='form-control' form-ignore='true' disabled={this.actions.disabledAsync} />
                            </div>
                        </section>
                    </form>
                </div>
            </div>);
    }
}