import { ActionType, DebugInfoData } from '../debug/debug-info-data';
import { DebugInfo } from '../debug/debug-info';
import { DataStrategyProvider } from '../data-strategy/data-strategy-provider';
import { Store } from './store';
import { UpdateActionAdditionalSettings } from '@react-state/data-strategy';

export class Update {
    static execute<T>(store: Store<T>) {
        const update = function (action: (state: any) => void, debugInfo: DebugInfoData = {}, additionalSettings?: UpdateActionAdditionalSettings) {

            const defaultDebugInfo = { actionType: ActionType.Update, statePath: store.statePath };
            DebugInfo.instance.add({ ...defaultDebugInfo, ...debugInfo });

            try {
                DataStrategyProvider.instance.update(store.statePath, action, additionalSettings);
            } catch (exception) {
                console.error(exception);
            }
        };

        return update;
    }
}

export interface UpdateSignature<T> {
    (action: (state: T) => void, debugInfo?: DebugInfoData, additionalSettings?: UpdateActionAdditionalSettings): void;
}