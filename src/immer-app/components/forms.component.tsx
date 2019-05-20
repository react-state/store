import * as React from 'react';
import { Store } from '../../../projects/react-state/src/store/store';
import { FormStateManager, CustomFormElement, CustomFormElementProps, ElementValueChangeEvent, FormElement, ShoulUpdateStateParams } from '../../../projects/react-state/src/store/plugins/form-manager.plugin';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class FormsComponent extends React.Component<any, any> {

    private form = React.createRef<HTMLFormElement>();
    private customFormElement = React.createRef<ComplexFormElementComponent>();

    private formStateManager: FormStateManager;
    private location: string;
    private unsubscribe = new Subject<any>();

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        Store.store.select(['form', 'location'])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(location => {
                this.location = location;
            });

        this.formStateManager = Store.store.select(['form']).form
            .bind(this.form.current)
            .addCustomFormElements([this.customFormElement.current])
            .shouldUpdateState((params: ShoulUpdateStateParams) => true)
            .onChange(state => this.forceUpdate())
            .sync();
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUnmount() {
        this.formStateManager.destroy();
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

    handleSubmit(event) {
        alert(this.form.current.files[0].name);
        event.preventDefault();
    }

    reset() {
        this.formStateManager.reset();
    }

    render() {
        return (
                <div style={{ width: '400px' }}>
                  <hr />
                  <button style={{ marginBottom: '15px' }} onClick={this.reset} className='btn btn-danger'>Reset</button>
                  <hr />
                  Selected location: {this.location}
                  <hr />
                  <form onSubmit={this.handleSubmit} ref={this.form}>
                    <section>
                      <h6>Car Condition:</h6>
                      <div className='form-check'>
                        <input className='form-check-input' id='new' type='checkbox' form-element-name='new' form-group-name='condition' />
                        <label className='form-check-label' htmlFor='new'>New</label>
                      </div>
                      <div className='form-check'>
                        <input className='form-check-input' id='used' type='checkbox' form-element-name='used' form-group-name='condition' />
                        <label htmlFor='used' className='form-check-label'>Used</label>
                      </div>
                      <div className='form-check'>
                        <input className='form-check-input' id='notspecified' type='checkbox' form-element-name='notSpecified' form-group-name='condition' />
                        <label htmlFor='notspecified' className='form-check-label'>Not specified</label>
                      </div>
                    </section>

                    <hr />
                    <section>
                      <h6>Car location:</h6>
                      <div className='form-check'>
                        <input className='form-check-input' id='usa' type='radio' value='usa' name='location' />
                        <label className='form-check-label' htmlFor='usa'>USA</label>
                      </div>
                      <div className='form-check'>
                        <input className='form-check-input' id='europe' type='radio' value='europe' name='location' /><label htmlFor='europe' className='form-check-label'>Europe</label>
                      </div>
                      <div className='form-check'>
                        <input className='form-check-input' id='asia' type='radio' value='asia' name='location' /><label htmlFor='asia' className='form-check-label'>Asia specified</label>
                      </div>
                    </section>

                    <hr />
                    <section>
                      <div className='form-group'>
                        <h6>Car model</h6>
                        <select className='form-control' multiple name='cars'>
                          <option value='volvo'>Volvo</option>
                          <option value='saab'>Saab</option>
                          <option value='opel'>Opel</option>
                          <option value='audi'>Audi</option>
                        </select>
                      </div>
                    </section>

                    <hr />
                    <section>
                      <div className='form-group'>
                        <label>Car color</label>
                        <select className='form-control' name='color'>
                          <option value='red'>Red</option>
                          <option value='white'>White</option>
                          <option value='blue'>Blue</option>
                          <option value='orange'>Orange</option>
                        </select>
                      </div>
                    </section>

                    <hr />
                    <section>
                      <h6>Car description:</h6>
                      <div className='form-group'>
                        <textarea className='form-control' name='description'></textarea>
                      </div>
                    </section>

                    <hr />
                    <section>
                      <h6>Owner address:</h6>
                      <div className='form-group'>
                        <input className='form-control' name='address' />
                      </div>
                    </section>

                    <hr />
                    <section>
                      <h6>Complex custom form element:</h6>
                      <ComplexFormElementComponent
                        ref={this.customFormElement}
                        form-element-name='complexElement'
                        form-group-name='group'>
                      </ComplexFormElementComponent>
                    </section>

                    <hr />
                    <p><input type='file' name='other-documents' /></p>

                    <hr />
                    <p><input className='btn btn-primary' type='submit' value='Submit' /></p>
                  </form>
                </div>
        );
    }
}

export class ComplexFormElementComponent extends React.Component<CustomFormElementProps, any> implements CustomFormElement {

    private inputElement = React.createRef<HTMLInputElement>();
    private takeUntil = new Subject<any>();

    onElementValueChange = new Subject<ElementValueChangeEvent>();
    onStateValueChange = new Subject<any>();

    complexElement: string;

    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.listenToStateChange();
    }

    componentDidMount() {
        Store.store.select(['form', 'group', 'complexElement'])
            .subscribe(complexElement => {
                this.complexElement = complexElement;
            });
    }

    componentWillUnmount() {
        this.takeUntil.next();
        this.takeUntil.unsubscribe();
    }

    listenToStateChange() {
        this.onStateValueChange
            .pipe(takeUntil(this.takeUntil))
            .subscribe(state => {
                this.inputElement.current.value = state;
            });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.onElementValueChange.next({
            target: this,
            value: event.target.value
        });

        event.stopPropagation();
    }

    render() {
        return (
            <div>
                Selected value: {this.complexElement}<br /><br />
                <input type='text' form-ignore='true' ref={this.inputElement} onChange={this.handleChange} />
            </div>
        );
    }
}