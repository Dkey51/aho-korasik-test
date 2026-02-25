import { BaseCommand } from './Command';
import { App } from '../App';

export class StatsCommand extends BaseCommand {
    execute = (app: App): void => {
        app.visualizer.showStats();
    };

    getName = (): string => 'Show statistics';
    getDescription = (): string => 'Display automaton statistics';
    getIcon = (): string => '📊';
}