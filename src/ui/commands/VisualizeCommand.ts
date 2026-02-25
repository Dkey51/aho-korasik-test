import { BaseCommand } from './Command';
import { App } from '../App';

export class VisualizeCommand extends BaseCommand {
    execute = (app: App): void => {
        app.visualizer.visualize();
    };

    getName = (): string => 'Visualize automaton';
    getDescription = (): string => 'Display the automaton structure';
    getIcon = (): string => '🌳';
}