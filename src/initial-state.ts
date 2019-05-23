let initialState = {
    todos: <any[]>[],
    storage: {
        itemToStore: 'some value'
    },
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
    },
    asyncDemo: {
        checkbox: false,
        disabled: true
    },
    interpolationTest: {
        interpolationOne: {
           value: 'int 1'
        },
        interpolationTwo: {
             value: 'int 2'
        }
    }
};

export { initialState };