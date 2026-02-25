import { ICommand } from './Command';
import { AddPatternCommand } from './AddPatternCommand';
import { BuildCommand } from './BuildCommand';
import { SearchCommand } from './SearchCommand';
import { VisualizeCommand } from './VisualizeCommand';
import { StatsCommand } from './StatsCommand';
import { ResetCommand } from './ResetCommand';
import { LogsCommand } from './LogsCommand';
import { ExitCommand } from './ExitCommand';

/**
 * Фабрика команд (Factory Pattern)
 * Создает команды по их идентификаторам
 */
export class CommandFactory {
    // Реестр команд
    private static commands: Record<string, new () => ICommand> = {
        add: AddPatternCommand,
        build: BuildCommand,
        search: SearchCommand,
        visualize: VisualizeCommand,
        stats: StatsCommand,
        reset: ResetCommand,
        logs: LogsCommand,
        exit: ExitCommand
    };

    // Создание команды по типу
    static createCommand = (type: string): ICommand | null => {
        const CommandClass = this.commands[type];
        return CommandClass ? new CommandClass() : null;
    };

    // Получение списка доступных команд для меню
    static getAvailableCommands = (): { name: string; value: string }[] => 
        Object.entries(this.commands).map(([value, cmd]) => ({
            name: `${new cmd().getIcon()} ${new cmd().getName()}`,
            value
        }));
}