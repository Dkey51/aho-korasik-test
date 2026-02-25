import { App } from './ui/App';
import { logger } from './logger/Logger';

/**
 * Точка входа в приложение
 */
const main = async (): Promise<void> => {
    try {
        const app = new App();
        await app.run();
    } catch (error) {
        logger.error('Fatal application error', { error });
        process.exit(1);
    }
};

// Запуск приложения
main();