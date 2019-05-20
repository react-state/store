import { Cursor } from './cursor';
import { ActionType, DebugInfoData } from '../debug/debug-info-data';
import { DebugInfo } from '../debug/debug-info';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';

export class Update {
    constructor(action: (state: any) => void, debugInfo: DebugInfoData = {}) {

        const defaultDebugInfo = { actionType: ActionType.Update, statePath: (<any>this).statePath };
        DebugInfo.instance.add({ ...defaultDebugInfo, ...debugInfo });

        try {
            DataStrategyProvider.instance.update((this as any).statePath, action);
        } catch (exception) {
            console.error(exception);
        }
    }
}

export interface UpdateSignature<T> {
    (action: (state: T) => void, debugInfo?: DebugInfoData): void;
}