import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { History } from 'history';
import { Main } from './components/main';
import { ReactState } from '../../projects/react-state/src';
import { initialState } from '../initial-state';
import { ImmerDataStrategy } from '../../projects/immer-data-strategy/src/immer.data-strategy';

const isPord = false;
if (document.getElementById('todos-app-immer')) {
    console.log('uu');
    ReactState
        .debugger(true, { enableConsoleOutput: false, })
        .changeHistoryDefaultOptions({ storeHistoryItems: 5 })
        .addDataStrategy(ImmerDataStrategy)
        .init((routerHistory: History) => {
            ReactDOM.render(<Main history={routerHistory} />, document.getElementById('todos-app-immer'));
        }, initialState, isPord);
}
