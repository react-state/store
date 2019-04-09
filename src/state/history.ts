import { Subject } from 'rxjs';
import { Helpers } from '../helpers/helpers';
import { HistoryController } from './history-controller';
import { fromJS } from 'immutable';
import { take } from 'rxjs/operators';
import { DebugInfoData } from '../store/debug-info-data';

export class StateHistory {
    static CURRENT_STATE: any = null;
    static initialState = {};

    static debugInfo: DebugInfoData = null;

    private static _viewHistory = new Subject<boolean>();
    private static debugMode = false;
    private static debugStatePath = null;

    private static withDevTools = false;
    private static devTools = null;;
    private static devToolsSubscription = null;;

    get currentState(): any {
        return StateHistory.CURRENT_STATE;
    }

    init(initialState: any, debugMode: boolean) {
        StateHistory.debugMode = debugMode;
        StateHistory.initialState = initialState;

        if (debugMode) {
            StateHistory.setWithDevTools();
        }
    }

    add(state: any) {
        const isInitialState = !StateHistory.CURRENT_STATE;
        StateHistory.CURRENT_STATE = state;

        if (StateHistory.debugMode) {
            StateHistory.trackWithDevTools([], false);
            this.logDebugInfo(state, isInitialState);
        }
    }

    private logDebugInfo(state: any, isInitialState: boolean) {
        let debugState = StateHistory.debugStatePath && state.getIn(StateHistory.debugStatePath) || state;
        if (Helpers.isImmutable(debugState)) {
            debugState = debugState.toJS();
        }

        const debugMessage = StateHistory.getDebugMessage();

        console.info(debugMessage, debugState);

        if (!StateHistory.withDevTools) {
            return;
        }

        if (isInitialState) {
            StateHistory.devTools.init(StateHistory.CURRENT_STATE.toJS());
        } else {
            StateHistory.devTools.send(debugMessage, debugState);
        }

        StateHistory.debugInfo = null;
    }

    private static getDebugMessage() {
        let message = "@state/";

        if (!this.debugInfo) {
            return `${message}${this.getDebugStatePath()}`
        }

        message += `${this.debugInfo.statePath.join('/')} - `;
        message += `${(this.debugInfo.message ? this.debugInfo.message.toUpperCase() : (this.debugInfo.actionType || ''))}`;

        return message;
    }

    private static getDebugStatePath() {
        return this.debugStatePath
            ? this.debugStatePath.join('->')
            : 'root';
    }

    static get viewHistory(): Subject<boolean> {
        return StateHistory._viewHistory;
    }

    static startDebugging(statePath: any[] = []) {
        StateHistory.debugStatePath = statePath;
        StateHistory.debugMode = true;

        this.stopTrackingWithDevTools();
        this.setWithDevTools();
        this.trackWithDevTools(statePath, true);
    }

    static stopDebugging() {
        StateHistory.debugMode = false;
        this.stopTrackingWithDevTools();
    }

    private static trackWithDevTools(statePath: any[], shouldInitialize: boolean) {
        if (!StateHistory.withDevTools || StateHistory.devTools) {
            return;
        }

        this.devTools = window['__REDUX_DEVTOOLS_EXTENSION__'].connect();
        this.devToolsSubscription = this.devTools.subscribe((message: any) => {
            if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {

                const debugModeOriginal = StateHistory.debugMode;
                StateHistory.debugMode = false;

                HistoryController.applyHistory(fromJS(JSON.parse(message.state)), statePath)
                    .pipe(take(1))
                    .subscribe(_ => {
                        StateHistory.debugMode = debugModeOriginal;
                    });
            }
        });

        if (shouldInitialize) {
            this.devTools.init(this.CURRENT_STATE.getIn(statePath).toJS());
        }
    }

    private static stopTrackingWithDevTools() {
        if (StateHistory.withDevTools) {
            StateHistory.withDevTools = false;
            window['__REDUX_DEVTOOLS_EXTENSION__'].disconnect();
            this.devToolsSubscription();
            this.devTools = null;
        }
    }

    private static setWithDevTools() {
        StateHistory.withDevTools = typeof window !== 'undefined' && !!window['__REDUX_DEVTOOLS_EXTENSION__'];
    }
}