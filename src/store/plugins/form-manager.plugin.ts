import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Observable, Subject, fromEvent, ReplaySubject } from 'rxjs';
import { Store } from '../store';
import { Map, fromJS } from 'immutable';
import { Helpers } from '../../helpers/helpers';

export class FormStateManager {

    private formGroupName = 'form-group-name';
    private formElementName = 'form-element-name';

    private unsubscribe = new Subject();
    private formElements: FormElement[];
    private params: FormStateManagerParams;
    private store: Store<any>;

    onChange = new ReplaySubject<any>(1);

    constructor(store: Store<any>) {
        this.store = store;
    }

    bind(form: React.RefObject<HTMLFormElement>, params: FormStateManagerParams = {}): FormStateManager {
        this.formElements = this.getFilteredFormElements(form);
        this.params = { ... { debounceTime: 100, emitEvent: false }, ...params };

        return this;
    }

    addCustomFormElements(elements: CustomFormElement[]) {
        for (let index = 0; index < elements.length; index++) {
            this.formElements.push({
                customElement: elements[index],
                type: 'custom',
                isIgnored: false
            });
        }

        return this;
    }

    sync() {
        this.setInitialValue(this.store);
        this.subscribeToFormChange(this.store);

        return this;
    }

    reset() {
        this.store.reset();
    }

    destroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();

        this.formElements = null;
        this.store = null;
    }

    private getFilteredFormElements(form: React.RefObject<HTMLFormElement>) {
        const elements = form.current.elements;
        const formElements = <FormElement[]>[]
        for (let i = 0; i < elements.length; i++) {
            const formElement = this.getElementAttributes(elements[i]);

            if (formElement.isIgnored) {
                continue;
            }

            formElements.push(formElement);
        }

        return formElements;
    }

    private setInitialValue(store: Store<any>) {
        store
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.unsubscribe)
            )
            .subscribe((state: Map<any, any>) => {
                for (let i = 0; i < this.formElements.length; i++) {
                    const formElement = this.formElements[i];
                    let stateValue = this.getValueFromState(state, formElement);

                    switch (formElement.type) {
                        case 'radio':
                            this.setRadioValue(formElement.element, stateValue);
                            break;
                        case 'checkbox':
                            this.setCheckboxValue(formElement.element, stateValue);
                            break;
                        case 'select':
                            this.setSelectValue(formElement.element, stateValue);
                            break;
                        case 'custom':
                            formElement.customElement.onStateValueChange.next(this.getValueFromState(state, formElement));
                            break;
                        default:
                            (<any>formElement.element).value = this.getValueFromState(state, formElement);
                            break;
                    }
                }

                this.onChange.next(state);
            });
    }

    private getValueFromState(state: any, item: FormElement) {
        const statePath = item.element
            ? this.getStatePath(item.element)
            : this.getCustomElementStatePath(item.customElement);

        let stateValue = state.getIn(statePath);
        if (Helpers.isImmutable(stateValue)) {
            stateValue = stateValue.toJS();
        }

        return stateValue;
    }

    private setSelectValue(element: any, value: string[]) {
        if (!value || value.length === 0) {
            return;
        }

        var options = element && element.options;
        for (var i = 0; i < options.length; i++) {
            options[i].selected = value.indexOf(options[i].value || options[i].text) !== -1
        }
    }

    private setRadioValue(element: any, value: any) {
        if (element.value === value) {
            element.checked = true;
        }
    }

    private setCheckboxValue(element: any, value: any) {
        element.checked = value;
    }

    private subscribeToFormChange(store: Store<any>) {
        for (let i = 0; i < this.formElements.length; i++) {
            if (this.formElements[i].element) {
                this.bindToElementEvent(this.formElements[i].element, store);
            } else {
                this.bindToCustomElementEvent(this.formElements[i].customElement, store);
            }
        }
    }

    private bindToCustomElementEvent(element: CustomFormElement, store: Store<any>) {
        element.onElementValueChange
            .pipe(
                debounceTime(this.params.debounceTime),
                distinctUntilChanged(),
                takeUntil(this.unsubscribe)
            )
            .subscribe((event: ElementValueChangeEvent) => {
                store.update((state: Map<any, any>) => {
                    state.setIn(this.getCustomElementStatePath(event.target), event.value);
                    this.onChange.next(state);
                });
            });
    }

    private bindToElementEvent(element: Element, store: Store<any>) {
        fromEvent(element, 'change')
            .pipe(
                debounceTime(this.params.debounceTime),
                distinctUntilChanged(),
                takeUntil(this.unsubscribe)
            )
            .subscribe((event: any) => {
                store.update((state: Map<any, any>) => {
                    state.setIn(this.getStatePath(event.target), this.getFormElementValue(event.target));
                    this.onChange.next(state);
                });
            });
    }

    private getMultiSelectValues(select: any) {
        const result = [];
        const options = select && select.options;
        let opt: { selected: any; value: any; text: any; };

        for (var i = 0; i < options.length; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return select.multiple
            ? fromJS(result)
            : result[0];
    }

    private getCustomElementStatePath(element: CustomFormElement) {
        return element.props[this.formGroupName]
            ? [element.props[this.formGroupName], element.props[this.formElementName]]
            : [element.props[this.formElementName]]
    }

    private getStatePath(element: Element) {
        const formGroupName = element.getAttribute(this.formGroupName);

        return formGroupName
            ? [formGroupName, this.getFormElementName(element)]
            : [this.getFormElementName(element)]
    }

    private getFormElementValue(element: any) {
        const type = this.getElementType(element);

        switch (type) {
            case 'checkbox':
                return element.checked;
            case 'select':
                return this.getMultiSelectValues(element);
            default:
                return element.value;
        }
    }

    private getElementAttributes(element: Element): FormElement {
        const elementType = this.getElementType(element);
        return {
            element: element,
            type: elementType,
            isIgnored: this.isELementBeIgnored(element, elementType)
        };
    }

    private getFormElementName(element: Element) {
        return element.getAttribute(this.formElementName) || element.getAttribute('name')
    }

    private isELementBeIgnored(element: Element, elementType: string) {
        return !!element.getAttribute('form-ignore') || elementType === 'file' || elementType === 'submit' || elementType === 'button';
    }

    private getElementType(element: Element) {
        const elementName = element.nodeName.toLowerCase();

        if (elementName === 'input') {
            const type = element.getAttribute('type');
            return type === 'checkbox' || type === 'radio' || type === 'file' || type === 'submit'
                ? type
                : 'input';
        }

        if (elementName === 'textarea' || elementName === 'select') {
            return elementName;
        }

        throw new Error(`Element type not supported: ${element.nodeName}`);
    }
}

interface FormElement {
    element?: Element;
    customElement?: CustomFormElement;
    type: string;
    isIgnored: boolean;
}

export type FormGroupLike = {
    patchValue: Function;
    setValue: Function;
    value: any;
    get: Function;
    valueChanges: Observable<any>;
    controls: any;
};

export type FormStateManagerParams = {
    debounceTime?: number;
    emitEvent?: boolean;
};

export interface CustomFormElement {
    props?: CustomFormElementProps;
    onElementValueChange: Subject<ElementValueChangeEvent>;
    onStateValueChange: Subject<any>;
}

export interface CustomFormElementProps {
    'form-group-name'?: string
    'form-element-name': string
}

export interface ElementValueChangeEvent {
    value: any;
    target: CustomFormElement;
}