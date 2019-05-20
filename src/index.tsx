import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { History } from 'history';
import { Main } from './components/main';
import { ReactState } from '../projects/react-state/src';
import { initialState } from './initial-state';

const isPord = false;

ReactState
    .debugger(true, { enableConsoleOutput: false, })
    .changeHistoryDefaultOptions({ storeHistoryItems: 5 })
    .init((routerHistory: History) => {
        ReactDOM.render(<Main history={routerHistory} />, document.getElementById('example'))
    }, initialState, isPord);
