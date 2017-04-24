import * as Rx from 'rxjs';

import { Store } from '../store/store';

export class StateHistory {
    static CURRENT_STATE: any = {};
    static HISTORY: any[] = [];

    private static collectHistory: boolean;
    private static _viewHistory = new Rx.Subject<boolean>();
    private static storeHistoryItems: number | null;

    constructor(private store: Store<any>, collectHistory: boolean, storeHistoryItems: number | null) {
        StateHistory.collectHistory = collectHistory;
        StateHistory.storeHistoryItems = storeHistoryItems;
    }

    init() {
        this.store.subscribe(state => {
            this.add(state);
        });
    }

    private add(state: any) {
        StateHistory.CURRENT_STATE = state;

        if (!StateHistory.collectHistory || StateHistory.HISTORY.indexOf(state) >= 0) {
            return;
        }

        if (StateHistory.HISTORY.length >= StateHistory.storeHistoryItems) {
            StateHistory.HISTORY.shift();
        };

        StateHistory.HISTORY.push(state);
    }

    static showHistory() {
        StateHistory.collectHistory = false;
        StateHistory._viewHistory.next(true);
    }

    static hideHistory() {
        StateHistory.collectHistory = true;
        StateHistory._viewHistory.next(false);
    }

    static get viewHistory(): Rx.Subject<boolean> {
        return StateHistory._viewHistory;
    }
}