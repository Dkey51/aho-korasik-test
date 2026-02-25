import { BaseCommand } from './Command';
import { App } from '../App';
import { Menu } from '../Menu';

export class ExitCommand extends BaseCommand {
    execute = async (app: App): Promise<void> => {
        const menu = new Menu(app);
        const confirmed = await menu.confirmExit();
        
        confirmed && app.exit();
    };

    getName = (): string => 'Exit';
    getDescription = (): string => 'Exit the application';
    getIcon = (): string => '❌';
}