import inquirer from 'inquirer';
import { BaseCommand } from './Command';
import { App } from '../App';

export class AddPatternCommand extends BaseCommand {
    execute = async (app: App): Promise<void> => {
        const { pattern } = await inquirer.prompt([{
            type: 'input',
            name: 'pattern',
            message: '📝 Enter pattern to add:',
            validate: (input: string) => input.length > 0 || 'Pattern cannot be empty'
        }]);
        
        app.automaton.addPattern(pattern);
    };

    getName = (): string => 'Add pattern';
    getDescription = (): string => 'Add a new search pattern';
    getIcon = (): string => '📝';
}