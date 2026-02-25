import figlet from 'figlet';
import { AhoCorasickAutomaton } from '../core/automaton/AhoCorasickAutomaton';
import { Visualizer } from '../visualization/Visualizer';
import { logger } from '../logger/Logger';
import { Menu } from './Menu';
import { CommandFactory } from './commands/CommandFactory';
import { colors } from '../visualization/themes/DefaultTheme';

/**
 * Главный класс приложения
 */
export class App {
    public readonly automaton: AhoCorasickAutomaton;
    public readonly visualizer: Visualizer;
    private readonly menu: Menu;
    private running: boolean = true;

    constructor() {
        this.automaton = new AhoCorasickAutomaton();
        this.visualizer = new Visualizer(this.automaton);
        this.menu = new Menu(this);
    }

    // Запуск приложения
    run = async (): Promise<void> => {
        this.displayTitle();
        
        while (this.running) {
            const action = await this.menu.show();
            await this.executeCommand(action);
        }
    };

    // Выполнение команды
    private executeCommand = async (action: string): Promise<void> => {
        const command = CommandFactory.createCommand(action);
        
        // Тернарный оператор для выполнения команды
        command 
            ? await command.execute(this)
            : logger.warning(`Unknown command: ${action}`);
    };

    // Отображение заголовка
    private displayTitle = (): void => {
        console.clear();
        const title = figlet.textSync('Aho-Corasick', { font: 'Standard' });
        console.log(colors.title(title));
        console.log(colors.secondary('='.repeat(60)));
        console.log(colors.info('📚 Algorithm Visualization Tool'));
        console.log(colors.debug('Developed by Alfred Aho & Margaret Corasick (1975)'));
        console.log(colors.secondary('='.repeat(60) + '\n'));
    };

    // Выход из приложения
    exit = (): void => {
        this.running = false;
        logger.printSummary();
        console.log(colors.success('\n✓ Thank you for using Aho-Corasick Visualizer!'));
    };
}