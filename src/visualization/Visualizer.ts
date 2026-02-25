import { IAutomaton } from '../core/automaton/interfaces';
import { TreeRenderer } from './renderers/TreeRenderer';
import { TableRenderer } from './renderers/TableRenderer';
import { SearchRenderer } from './renderers/SearchRenderer';
import { logger } from '../logger/Logger';

/**
 * Главный класс визуализации
 * Объединяет все рендереры
 */
export class Visualizer {
    constructor(private automaton: IAutomaton) {}

    // Визуализация автомата
    visualize = (): void => {
        this.automaton.patterns.length
            ? TreeRenderer.render(this.automaton.root, this.automaton.patterns)
            : logger.warning('No patterns to visualize');
    };

    // Показ статистики
    showStats = (): void => {
        TableRenderer.renderStats(this.automaton.getStats());
    };

    // Показ шага поиска
    showSearchStep = (text: string, pos: number, node: any, found: any[]): void => {
        SearchRenderer.renderStep(text, pos, node, found);
    };

    // Показ логов
    showLogs = (logs: any[]): void => {
        TableRenderer.renderLogs(logs);
    };
}