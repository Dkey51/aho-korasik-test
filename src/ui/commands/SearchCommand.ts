import inquirer from 'inquirer';
import { BaseCommand } from './Command';
import { App } from '../App';
import { TableRenderer } from '../../visualization/renderers/TableRenderer';
import { SearchRenderer } from '../../visualization/renderers/SearchRenderer';

export class SearchCommand extends BaseCommand {
    execute = async (app: App): Promise<void> => {
        const { text } = await inquirer.prompt([{
            type: 'input',
            name: 'text',
            message: '🔍 Enter text to search in:',
            validate: (input: string) => input.length > 0 || 'Text cannot be empty'
        }]);

        const results = app.automaton.search(text);
        
        // Тернарный оператор для выбора рендерера
        results.length 
            ? TableRenderer.renderSearchResults(results)
            : SearchRenderer.renderNoResults();
    };

    getName = (): string => 'Search in text';
    getDescription = (): string => 'Find all pattern occurrences';
    getIcon = (): string => '🔍';
}