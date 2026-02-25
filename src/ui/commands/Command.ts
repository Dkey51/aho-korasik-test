import { App } from '../App';

/**
 * Интерфейс команды (Command Pattern)
 */
export interface ICommand {
    execute(app: App): Promise<void> | void;
    getName(): string;
    getDescription(): string;
    getIcon(): string;
}

/**
 * Базовый класс для всех команд
 */
export abstract class BaseCommand implements ICommand {
    abstract execute(app: App): Promise<void> | void;
    abstract getName(): string;
    abstract getDescription(): string;
    abstract getIcon(): string;
}