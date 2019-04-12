import * as React from "react";
import { FormsComponent } from './forms.component';
import { ReactStateTestBed } from "../src/react-state.test-bed";
import * as ReactDOM from "react-dom";
import { Store } from "../src/store/store";
import { act } from 'react-dom/test-utils';
import { StateHistory } from "../src/state/history";
import { fromJS } from "immutable";

jest.useFakeTimers();

describe('Forms manager', () => {
    let container: HTMLElement;
    let component: any;

    beforeAll(() => {
        ReactStateTestBed.setTestEnvironment();
    });

    beforeEach(() => {
        Store.store = ReactStateTestBed.createStore(intialState);

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            component = ReactDOM.render(<FormsComponent />, container);
        });
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    describe('initial state', () => {
        it('should be set on checkboxes', () => {
            const newCheckbox = container.querySelector('[form-element-name="new"]') as HTMLFormElement;
            const usedCheckbox = container.querySelector('[form-element-name="used"]') as HTMLFormElement;
            const notSpecifiedCheckbox = container.querySelector('[form-element-name="notSpecified"]') as HTMLFormElement;

            expect(newCheckbox.checked).toBeTruthy();
            expect(usedCheckbox.checked).toBeFalsy();
            expect(notSpecifiedCheckbox.checked).toBeTruthy();
        });

        it('should be set on radiobuttons', () => {
            const location = container.querySelector('[name=location]:checked') as HTMLFormElement;

            expect(location.value).toBe('europe');
        });

        it('should be set on multiselect', () => {
            const model = container.querySelector('[name=cars]') as HTMLFormElement;
            const selectedValues = getMultiSelectValues(model)

            expect(selectedValues.length).toEqual(2);
            expect(selectedValues[0]).toBe('volvo');
            expect(selectedValues[1]).toBe('opel');
        });

        it('should be set on select', () => {
            const model = container.querySelector('[name=color]') as HTMLFormElement;
            const selectedValue = getMultiSelectValues(model)

            expect(selectedValue).toBe('orange');
        });

        it('should be set on textarea', () => {
            const description = container.querySelector('[name=description]') as HTMLFormElement;

            expect(description.value).toBe('car description');
        });

        it('should be set on input field', () => {
            const address = container.querySelector('[name=address]') as HTMLFormElement;

            expect(address.value).toBe('Some Street 1a');
        });

        it('should be set on custom form element', () => {
            const customElementInput = container.querySelector('[name=custom-component-input]') as HTMLFormElement;

            expect(customElementInput.value).toBe('complex element value');
        });
    });

    describe('on interaction with form', () => {
        it('should update checkbox value in state', () => {
            const newCheckbox = container.querySelector('[form-element-name=new]') as HTMLFormElement;

            act(() => {
                newCheckbox.checked = !newCheckbox.checked;
                newCheckbox.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'condition', 'new'])).toBeFalsy();
        });

        it('should update radiobutton value in state', () => {
            const radio = document.querySelectorAll('[name=location]')[0] as HTMLFormElement;

            act(() => {
                radio.checked = !radio.checked;
                radio.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'location'])).toBe('usa');
        });

        it('should update multiselect value in state', () => {
            const options = container.querySelectorAll('[name=cars] option');
            const select = container.querySelector('[name=cars]');

            act(() => {
                (options[0] as any).selected = false;
                (options[1] as any).selected = true;
                (options[2] as any).selected = false;
                (options[3] as any).selected = true;
                select.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'cars', 0])).toBe('saab');
            expect(StateHistory.instance.currentState.getIn(['form', 'cars', 1])).toBe('audi');
        });

        it('should update select value in state', () => {
            const options = container.querySelectorAll('[name=color] option');
            const select = container.querySelector('[name=color]');

            act(() => {
                (options[1] as any).selected = true;
                select.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'color'])).toBe('white');
        });

        it('should update textarea value in state', () => {
            const input = container.querySelector('[name=description]') as HTMLFormElement;

            act(() => {
                input.value = 'test';
                input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'description'])).toBe('test');
        });

        it('should update input value in state', () => {
            const input = container.querySelector('[name=address]') as HTMLFormElement;

            act(() => {
                input.value = 'test';
                input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'address'])).toBe('test');
        });

        it('should update custom form element value in state', () => {
            const input = container.querySelector('[name=custom-component-input]') as HTMLFormElement;
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor((window as any).HTMLInputElement.prototype, "value").set;

            act(() => {
                nativeInputValueSetter.call(input, 'test');
                input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
            });

            jest.runAllTimers();

            expect(StateHistory.instance.currentState.getIn(['form', 'group', 'complexElement'])).toBe('test');
        });
    });

    it('should call onChange hook after state change', () => {
        spyOn(component, 'onChangeMock').and.callThrough();
        const input = container.querySelector('[name=address]') as HTMLFormElement;

        act(() => {
            input.value = 'test';
            input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
        });

        jest.runAllTimers();

        const changedInitialState = { ...intialState.form };
        changedInitialState.address = 'test';

        expect(component.onChangeMock).toHaveBeenCalledWith(fromJS(changedInitialState));
    });

    it('should call shouldUpdateState hook before state change', () => {
        spyOn(component, 'shouldUpdateResult').and.callThrough();

        const input = container.querySelector('[name=address]') as HTMLFormElement;

        act(() => {
            input.value = 'test';
            input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
        });

        jest.runAllTimers();

        expect(component.shouldUpdateResult).toHaveBeenCalled();
    });

    it('should not update state if shouldUpdateState hook returns false', () => {
        spyOn(component, 'shouldUpdateResult').and.returnValue(false);

        const input = container.querySelector('[name=address]') as HTMLFormElement;

        act(() => {
            input.value = 'test';
            input.dispatchEvent(new MouseEvent('change', { bubbles: true }));
        });

        jest.runAllTimers();

        expect(StateHistory.instance.currentState.getIn(['form', 'address'])).toBe('Some Street 1a');
    });
});

var getMultiSelectValues = (select: HTMLFormElement) => {
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
        ? result
        : result[0];
}

const intialState = {
    form: {
        condition: {
            new: true,
            used: false,
            notSpecified: true,
        },
        location: 'europe',
        address: 'Some Street 1a',
        cars: ['volvo', 'opel'],
        color: 'orange',
        description: 'car description',
        group: {
            complexElement: 'complex element value'
        }
    }
};

