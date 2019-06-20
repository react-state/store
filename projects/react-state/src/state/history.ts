export class StateHistory {
    private static _instance: StateHistory = null;

    private options: StateHistoryOptions = {
        collectHistory: true,
        storeHistoryItems: 100
    };

    initialState = {};

    static get instance(): StateHistory {
        if (!this._instance) {
            this._instance = new StateHistory();
        }

        return this._instance;
    }

    get currentState(): any {
        return StateKeeper.CURRENT_STATE;
    }

    get history(): HistoryItem[] {
        return StateKeeper.HISTORY;
    }

    set history(history: HistoryItem[]) {
        StateKeeper.HISTORY = history;
    }

    get storeHistoryItems() {
        return this.options.storeHistoryItems;
    }

    init(initialState: any) {
        this.initialState = initialState;
    }

    changeDefaults(options: StateHistoryOptions) {
        this.options = { ...this.options, ...options };
    }

    setCurrentState(state: any) {
        StateKeeper.CURRENT_STATE = state;
        this.add({ state: state, tag: null });
    }

    add(item: HistoryItem) {
        if (!this.options.collectHistory) {
            return;
        }

        if (StateKeeper.HISTORY.length >= this.options.storeHistoryItems) {
            StateKeeper.HISTORY.shift();
        }

        StateKeeper.HISTORY.push(item);
    }
}

export class StateKeeper {
    static CURRENT_STATE: any = null;
    static HISTORY = [];
}

export interface StateHistoryOptions {
    collectHistory?: boolean;
    storeHistoryItems?: number | null;
}

export interface HistoryItem {
    tag?: string;
    state: any;
}