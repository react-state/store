import { ActionType } from './debug-info-data';
import { StateHistory } from '../state/history';

export class DebugInfo {
    static add(message: string, action: ActionType | string) {
        StateHistory.debugInfo = {
            message: message,
            actionType: action,
            statePath: (<any>this).statePath
        };
    }
}