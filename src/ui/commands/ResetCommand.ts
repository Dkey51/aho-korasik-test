import { BaseCommand } from './Command';
import { App } from '../App';
import { logger } from '../../logger/Logger';
import { colors } from '../../visualization/themes/DefaultTheme';

export class ResetCommand extends BaseCommand {
    execute = (app: App): void => {
        app.automaton.reset();
        logger.clearLogs();
        console.log(colors.success('✓ Automaton reset successfully'));
    };

    getName = (): string => 'Reset automaton';
    getDescription = (): string => 'Clear all patterns and start over';
    getIcon = (): string => '🔄';
}