import { ILogEntry } from '../core/automaton/interfaces';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

/**
 * Интерфейс наблюдателя для логов (Observer Pattern)
 */
export interface LogObserver {
    onLog(entry: ILogEntry): void;
}