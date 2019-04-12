export interface DebugInfoData {
    actionType?: ActionType | string,
    message?: string;
    statePath?: any[];
}

export const enum ActionType {
    Update = 'UPDATE',
    Clear = 'CLEAR',
    Reset = 'RESET',
    Insert = 'INSERT',
    Delete = 'DELETE'
}