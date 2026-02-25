import Table from 'cli-table3';
import chalk from 'chalk';
import { ISearchResult, IAutomatonStats } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для табличных данных
 */
export class TableRenderer {
    // Отрисовка результатов поиска
    static renderSearchResults = (results: ISearchResult[]): void => {
        const table = new Table({
            head: ['Pattern', 'Position', 'End', 'Index'],
            style: { head: ['cyan'] }
        });
        
        results.forEach(r => table.push([r.pattern, r.position, r.endPosition, r.index]));
        
        console.log('\n' + chalk.bold('📋 SEARCH RESULTS:'));
        console.log(table.toString());
    };

    // Отрисовка статистики автомата
    static renderStats = (stats: IAutomatonStats): void => {
        const table = new Table({ style: { head: ['cyan'] } });
        
        table.push(
            { '📊 Patterns': stats.patternCount },
            { '🌳 Nodes': stats.nodeCount },
            { '📏 Max Depth': stats.maxDepth },
            { '🎯 Terminals': stats.terminalCount },
            { '🔧 Built': stats.built ? colors.success('Yes') : colors.warning('No') }
        );
        
        console.log('\n' + chalk.bold('📈 AUTOMATON STATISTICS:'));
        console.log(table.toString());
        
        // Список паттернов
        if (stats.patterns.length) {
            console.log(chalk.bold('\n📝 Patterns:'));
            stats.patterns.forEach((p, i) => 
                console.log(`   ${i + 1}. "${p}"`));
        }
    };

    // Отрисовка логов
    static renderLogs = (logs: any[]): void => {
        if (!logs.length) {
            console.log(colors.warning(`${symbols.warning} No logs available`));
            return;
        }

        console.log('\n' + chalk.bold('📋 RECENT LOGS:'));
        console.log(chalk.gray('─'.repeat(60)));
        
        logs.slice(-10).forEach(log => {
            const time = chalk.gray(`[${log.timestamp.toLocaleTimeString()}]`);
            const type = this.getLogColoredPrefix(log.type);
            console.log(`${time} ${type} ${log.message}`);
        });
    };

    // Цветной префикс для типа лога
    private static getLogColoredPrefix = (type: string): string => {
        const prefixes: Record<string, string> = {
            info: colors.info('INFO'),
            success: colors.success('SUCCESS'),
            warning: colors.warning('WARNING'),
            error: colors.error('ERROR'),
            debug: colors.debug('DEBUG')
        };
        return prefixes[type] ?? type;
    };
}