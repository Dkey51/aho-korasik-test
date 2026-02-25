import { BaseCommand } from './Command';
import { App } from '../App';
import { logger } from '../../logger/Logger';

export class LogsCommand extends BaseCommand {
    execute = (app: App): void => {
        app.visualizer.showLogs(logger.getLogs());
    };

    getName = (): string => 'View logs';
    getDescription = (): string => 'Display recent activity logs';
    getIcon = (): string => '📋';
}