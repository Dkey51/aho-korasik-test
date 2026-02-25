import chalk from 'chalk';
import { LogLevel, LogObserver } from './LogObserver';
import { ILogEntry } from '../core/automaton/interfaces';

/**
 * Синглтон логгера с поддержкой наблюдателей
 */
class Logger {
    private static instance: Logger;
    private logs: ILogEntry[] = [];
    private observers: LogObserver[] = [];

    private constructor() {}

    static getInstance = (): Logger => 
        Logger.instance ?? (Logger.instance = new Logger());

    // Создание записи лога
    private createEntry = (level: LogLevel, message: string, data?: any): ILogEntry => ({
        timestamp: new Date(),
        type: level,
        message,
        data
    });

    // Основной метод логирования
    private log = (level: LogLevel, message: string, data?: any): void => {
        const entry = this.createEntry(level, message, data);
        this.logs.push(entry);
        this.notifyObservers(entry);
        this.display(entry);
    };

    // Отображение лога в консоли
    private display = ({ type, message, timestamp }: ILogEntry): void => {
        const time = chalk.gray(`[${timestamp.toLocaleTimeString()}]`);
        const prefix = this.getPrefix(type);
        console.log(`${time} ${prefix} ${message}`);
    };

    // Получение цветного префикса для типа лога
    private getPrefix = (type: LogLevel): string => {
        const colors = {
            info: chalk.blue('ℹ INFO:'),
            success: chalk.green('✓ SUCCESS:'),
            warning: chalk.yellow('⚠ WARNING:'),
            error: chalk.red('✗ ERROR:'),
            debug: chalk.gray('🔍 DEBUG:')
        };
        return colors[type];
    };

    // Публичные методы логирования
    info = (message: string, data?: any): void => this.log('info', message, data);
    success = (message: string, data?: any): void => this.log('success', message, data);
    warning = (message: string, data?: any): void => this.log('warning', message, data);
    error = (message: string, data?: any): void => this.log('error', message, data);
    debug = (message: string, data?: any): void => this.log('debug', message, data);

    // Получение всех логов
    getLogs = (): ILogEntry[] => this.logs;

    // Очистка логов
    clearLogs = (): void => {
        this.logs = [];
    };

    // Печать сводки по логам
    printSummary = (): void => {
        const counts = this.logs.reduce((acc, log) => ({
            ...acc,
            [log.type]: (acc[log.type] || 0) + 1
        }), {} as Record<string, number>);

        console.log('\n' + chalk.bold('📊 LOG SUMMARY:'));
        Object.entries(counts).forEach(([type, count]) => 
            console.log(`   ${this.getPrefix(type as LogLevel)} ${count}`));
    };

    // Observer pattern методы
    subscribe = (observer: LogObserver): void => {
        this.observers.push(observer);
    };

    unsubscribe = (observer: LogObserver): void => {
        this.observers = this.observers.filter(o => o !== observer);
    };

    private notifyObservers = (entry: ILogEntry): void => {
        this.observers.forEach(o => o.onLog(entry));
    };
}

// Экспортируем синглтон
export const logger = Logger.getInstance();