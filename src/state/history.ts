import { Subject } from 'rxjs';

export class StateHistory {
    static CURRENT_STATE: any = {};
    static HISTORY = [];
    static collectHistory = true;
    static storeHistoryItems: number | null = 100;
    static initialState = {};

    private static _viewHistory = new Subject<boolean>();
    private static debugMode = false;
    private static debugStatePath = null;

    constructor(collectHistory: boolean | null = null, storeHistoryItems: number | null = null) {
        if (collectHistory !== null) {
            StateHistory.collectHistory = collectHistory;
        }

        if (storeHistoryItems !== null) {
            StateHistory.storeHistoryItems = storeHistoryItems;
        }
    }

    get currentState(): any {
        return StateHistory.CURRENT_STATE;
    }

    init(initialState: any) {
        StateHistory.initialState = initialState;
    }

    add(state: any) {
        StateHistory.CURRENT_STATE = state;

        if (!StateHistory.collectHistory || StateHistory.HISTORY.indexOf(state) >= 0) {
            return;
        }

        if (StateHistory.HISTORY.length >= StateHistory.storeHistoryItems) {
            StateHistory.HISTORY.shift();
        };

        StateHistory.HISTORY.push(state);

        if (StateHistory.debugMode) {
            console.info((StateHistory.debugStatePath && state.getIn(StateHistory.debugStatePath) || state).toJS());
        }
    }

    static showHistory() {
        StateHistory.collectHistory = false;
        StateHistory._viewHistory.next(true);
    }

    static hideHistory() {
        StateHistory.collectHistory = true;
        StateHistory._viewHistory.next(false);
    }

    static get viewHistory(): Subject<boolean> {
        return StateHistory._viewHistory;
    }

    static startDebugging(statePath?: any[]) {
        StateHistory.debugStatePath = statePath;
        StateHistory.debugMode = true;
    }

    static stopDebugging() {
        StateHistory.debugMode = false;
    }
}