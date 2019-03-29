import * as React from "react";
import { FormStateManager, CustomFormElement, CustomFormElementProps, ElementValueChangeEvent, FormElement, ShoulUpdateStateParams } from "../src/store/plugins/form-manager.plugin";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Store } from "../src/store/store";

export class FormsComponent extends React.Component<any, undefined> {

    private form = React.createRef<HTMLFormElement>();
    private customFormElement = React.createRef<ComplexFormElementComponent>();

    private formStateManager: FormStateManager;
    private unsubscribe = new Subject<any>();

    constructor(props: any) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        this.formStateManager = Store.store.select(['form']).form
            .bind(this.form.current)
            .addCustomFormElements([this.customFormElement.current])
            .shouldUpdateState(this.shouldUpdateState)
            .onChange(this.onChange)
            .sync();
    }

    componentWillUnmount() {
        this.formStateManager.destroy();
        this.unsubscribe.next();
        this.unsubscribe.unsubscribe();
    }

    onChange = (state: any) => {
        this.forceUpdate();
        this.onChangeMock(state);
    }

    onChangeMock(state: any) {
    }

    handleSubmit(event: any) {
        alert(this.form.current.files[0].name)
        event.preventDefault()
    }

    reset() {
        this.formStateManager.reset();
    }

    shouldUpdateState = (params: ShoulUpdateStateParams) => {
        return this.shouldUpdateResult();
    }

    shouldUpdateResult() {
        return true;
    }

    render() {
        return (
            <div>
                <button style={{ marginBottom: '15px' }} onClick={this.reset}>Reset</button>

                <form onSubmit={this.handleSubmit} ref={this.form}>
                    <section>
                        <h6>Car Condition:</h6>
                        <p><input type="checkbox" id="test" form-element-name="new" form-group-name="condition" /> New</p>
                        <p><input type="checkbox" form-element-name="used" form-group-name="condition" /> Used</p>
                        <p><input type="checkbox" form-element-name="notSpecified" form-group-name="condition" /> Not specified</p>
                    </section>

                    <hr />
                    <section>
                        <h6>Car location:</h6>
                        <p><input type="radio" value="usa" name="location" /> USA</p>
                        <p><input type="radio" value="europe" name="location" /> Europe</p>
                        <p><input type="radio" value="asia" name="location" /> Asia specified</p>
                    </section>

                    <hr />
                    <section>
                        <h6>Car model:</h6>
                        <select multiple name="cars">
                            <option value="volvo">Volvo</option>
                            <option value="saab">Saab</option>
                            <option value="opel">Opel</option>
                            <option value="audi">Audi</option>
                        </select>
                    </section>

                    <hr />
                    <section>
                        <h6>Car color:</h6>
                        <select name="color">
                            <option value="red">Red</option>
                            <option value="white">White</option>
                            <option value="blue">Blue</option>
                            <option value="orange">Orange</option>
                        </select>
                    </section>

                    <hr />
                    <section>
                        <h6>Car description:</h6>
                        <textarea name="description"></textarea>
                    </section>

                    <hr />
                    <section>
                        <h6>Owner address:</h6>
                        <input type="text" name="address" />
                    </section>

                    <hr />
                    <section>
                        <h6>Complex custom form element:</h6>
                        <ComplexFormElementComponent
                            ref={this.customFormElement}
                            form-element-name="complexElement"
                            form-group-name="group">
                        </ComplexFormElementComponent>
                    </section>

                    <hr />
                    <p><input type="file" name="other-documents" /></p>

                    <hr />
                    <p><input type="submit" value="Submit" /></p>
                </form>
            </div>
        )
    }
}

export class ComplexFormElementComponent extends React.Component<CustomFormElementProps, any> implements CustomFormElement {

    private inputElement = React.createRef<HTMLInputElement>()
    private takeUntil = new Subject<any>();

    onElementValueChange = new Subject<ElementValueChangeEvent>();
    onStateValueChange = new Subject<any>();

    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.listenToStateChange();
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
            <input type="text" name="custom-component-input" form-ignore="true" ref={this.inputElement} onChange={this.handleChange} />
        );
    }
}