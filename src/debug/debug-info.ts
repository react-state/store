import { DebugInfoData } from './debug-info-data';
import { Helpers } from '../helpers/helpers';
import { HistoryController } from '../state/history-controller';
import { fromJS } from 'immutable';
import { take } from 'rxjs/operators';
import { StateHistory } from '../state/history';

export class DebugInfo {
    private static _instance: DebugInfo = null;

    private debugInfo: DebugInfoData = null;
    private debugMode: boolean;
    private withDevTools: boolean;
    private debugStatePath = null;
    private devTools = null;;
    private devToolsSubscription = null;
    private options: DebugOptions = {
        enableConsoleOutput: true,
        enableDevToolsOutput: true
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new DebugInfo();
        }

        return this._instance;
    }

    get publicApi() {
        return {
            start: this.start,
            stop: this.stop
        };
    }

    init(debugMode: boolean) {
        this.debugMode = debugMode;
        this.setWithDevTools();

        if (!this.withDevTools || !debugMode) {
            return;
        }

        this.trackWithDevTools([]);
    }

    changeDefaults(options: DebugOptions) {
        this.options = { ...this.options, ...options };
    }

    add(info: DebugInfoData) {
        if (this.debugMode) {
            this.debugInfo = { ...info };
        }
    }

    onStateChange(state: any, isIntialState: boolean) {
        if (this.debugMode) {
            this.logDebugInfo(state, isIntialState);
        }
    }

    private logDebugInfo(state: any, isIntialState: boolean) {
        let debugState = this.debugStatePath && state.getIn(this.debugStatePath) || state;
        if (Helpers.isImmutable(debugState)) {
            debugState = debugState.toJS();
        }

        const debugMessage = this.getDebugMessage();
        this.consoleLog(debugMessage, debugState);

        if (!this.withDevTools) {
            return;
        }

        if (isIntialState) {
            this.devTools.init(debugState);
        } else {
            this.devTools.send(debugMessage, debugState);
        }

        this.debugInfo = null;
    }

    private consoleLog(message: string, state: any) {
        if (this.options.enableConsoleOutput) {
            console.info(message, state);
        }
    }

    private getDebugMessage() {
        let message = "@state/";

        if (!this.debugInfo) {
            return `${message}${this.getDebugStatePath()}`
        }

        message += `${this.debugInfo.statePath.join('/')} - `;
        message += `${(this.debugInfo.message ? this.debugInfo.message.toUpperCase() : (this.debugInfo.actionType || ''))}`;

        return message;
    }

    private getDebugStatePath() {
        return this.debugStatePath
            ? this.debugStatePath.join('->')
            : 'root';
    }

    private trackWithDevTools(statePath: any[]) {
        if (!this.withDevTools || this.devTools) {
            return;
        }

        this.devTools = window['__REDUX_DEVTOOLS_EXTENSION__'].connect();
        this.devToolsSubscription = this.devTools.subscribe((message: any) => {
            if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {

                const debugModeOriginal = this.debugMode;
                this.debugMode = false;

                HistoryController.applyHistory(fromJS(JSON.parse(message.state)), statePath)
                    .pipe(take(1))
                    .subscribe(_ => {
                        this.debugMode = debugModeOriginal;
                    });
            }
        });
    }

    private stopTrackingWithDevTools() {
        if (this.withDevTools) {
            this.withDevTools = false;
            window['__REDUX_DEVTOOLS_EXTENSION__'].disconnect();
            this.devToolsSubscription();
            this.devTools = null;
        }
    }

    private setWithDevTools() {
        this.withDevTools = this.options.enableDevToolsOutput && typeof window !== 'undefined' && !!window['__REDUX_DEVTOOLS_EXTENSION__'];
    }

    private start = (statePath: any[] = []) => {
        this.debugStatePath = statePath;
        this.debugMode = true;

        this.stopTrackingWithDevTools();
        this.setWithDevTools();
        this.trackWithDevTools(statePath);
        this.onStateChange(StateHistory.instance.currentState, true);
    }

    private stop = () => {
        this.debugMode = false;
        this.stopTrackingWithDevTools();
    }
}

export interface DebugOptions {
    enableConsoleOutput?: boolean;
    enableDevToolsOutput?: boolean;
}