import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { History } from 'history';
import { Main as ImmutableMain } from './immutablejs-app/components/main';
import { Main as ImmerMain } from './immer-app/components/main';
import { ReactState } from '../projects/react-state/src';
import { initialState } from './initial-state';
import { ImmutableJsDataStrategy } from '../projects/immutable-data-strategy/src/immutablejs.data-strategy';
import { ImmerDataStrategy } from '../projects/immer-data-strategy/src/immer.data-strategy';

const isPord = false;

if (window.location.search === '') {
    ReactState
        .debugger(true, { enableConsoleOutput: false, })
        .changeHistoryDefaultOptions({ storeHistoryItems: 5 })
        .addDataStrategy(ImmutableJsDataStrategy)
        .init((routerHistory: History) => {
            ReactDOM.render(<ImmutableMain history={routerHistory} />, document.getElementById('exampleapp'));
        }, initialState, isPord);
} else if (window.location.search === '?immer') {
    ReactState
        .debugger(true, { enableConsoleOutput: false, })
        .changeHistoryDefaultOptions({ storeHistoryItems: 5 })
        .addDataStrategy(ImmerDataStrategy)
        .init((routerHistory: History) => {
            ReactDOM.render(<ImmerMain history={routerHistory} />, document.getElementById('exampleapp'));
        }, initialState, isPord);
}
