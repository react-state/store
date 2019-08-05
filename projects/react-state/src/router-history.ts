import { RouterState } from './state/router-state';
import { History } from 'history';

export class RouterHistory {
    static get history(): History {
        return RouterState.instance.history;
    }
}