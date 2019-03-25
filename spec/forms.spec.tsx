import * as React from "react";
import { FormsComponent } from './forms.component';
import { ReactStateTestBed } from "../src/react-state.test-bed";
import * as ReactDOM from "react-dom";
import { Store } from "../src/store/store";
import { act } from 'react-dom/test-utils';

describe('Forms manager', () => {
    let container: HTMLElement;

    beforeAll(() => {
        ReactStateTestBed.setTestEnvironment();
    });

    beforeEach(() => {
        Store.store = ReactStateTestBed.createStore(intiialState);

        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
      });

    describe('initial state', () => {
        beforeEach(() => {
            act(() => {
                ReactDOM.render(<FormsComponent />, container);
            });
        });

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

const intiialState = {
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

