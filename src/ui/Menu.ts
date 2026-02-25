import inquirer from 'inquirer';
import { CommandFactory } from './commands/CommandFactory';
import { App } from './App';

/**
 * Класс меню приложения
 */
export class Menu {
    constructor(private app: App) {}

    // Показ главного меню
    show = async (): Promise<string> => {
        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: '🔧 What would you like to do?',
            choices: CommandFactory.getAvailableCommands()
        }]);

        return action;
    };

    // Подтверждение выхода
    confirmExit = async (): Promise<boolean> => {
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: '👋 Are you sure you want to exit?',
            default: false
        }]);

        return confirm;
    };
}