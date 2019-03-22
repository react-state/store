import * as React from "react";
import { mount, configure, ReactWrapper } from 'enzyme';
import { FormsComponent } from './forms.component';
import { ReactStateTestBed } from "../src/react-state.test-bed";
import * as Adapter from 'enzyme-adapter-react-16';
import { Store } from "../src/store/store";

describe('Forms manager', () => {
    let wrapper: ReactWrapper;

    beforeAll(() => {
        ReactStateTestBed.setTestEnvironment();
        configure({ adapter: new Adapter() });
    });

    beforeEach(() => {
        Store.store = ReactStateTestBed.createStore(intiialState);
        wrapper = mount(<FormsComponent />);
    });

    describe('initial state', () => {
        it('should be set on checkboxes', () => {
            const t = wrapper.find('#test').getElement();
            expect(wrapper.find('[form-element-name="new"]')).toBeChecked();
        });
    });
});

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

