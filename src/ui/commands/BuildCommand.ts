import { BaseCommand } from './Command';
import { App } from '../App';
import { createSpinner } from 'nanospinner';

export class BuildCommand extends BaseCommand {
    execute = (app: App): void => {
        const spinner = createSpinner('Building failure links...').start();
        
        app.automaton.buildFailureLinks();
        
        spinner.success({ text: 'Failure links built successfully!' });
    };

    getName = (): string => 'Build failure links';
    getDescription = (): string => 'Construct failure links for automaton';
    getIcon = (): string => '🔗';
}