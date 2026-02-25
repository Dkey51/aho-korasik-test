import Table from 'cli-table';
import chalk from 'chalk';
import { ISearchResult, IAutomatonStats } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для табличных данных
 * Отвечает за отображение результатов в виде таблиц
 */
export class TableRenderer {
    /**
     * Отрисовка результатов поиска
     * @param results - массив результатов поиска
     */
    static renderSearchResults = (results: ISearchResult[]): void => {
        const table = new Table({
            head: ['Pattern', 'Position', 'End', 'Index', 'Length'],
            style: { head: ['cyan'] },
            colWidths: [15, 10, 10, 8, 8]
        });
        
        results.forEach(r => table.push([
            colors.terminal(r.pattern),
            r.position.toString(),
            r.endPosition.toString(),
            r.index.toString(),
            (r.endPosition - r.position + 1).toString()
        ]));
        
        console.log('\n' + chalk.bold('📋 SEARCH RESULTS:'));
        console.log(colors.secondary('─'.repeat(60)));
        console.log(table.toString());
        
        // Сводка
        console.log(colors.success(`${symbols.success} Total found: ${results.length}`));
        
        // Группировка по паттернам
        const byPattern = results.reduce((acc, r) => {
            acc[r.pattern] = (acc[r.pattern] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        console.log(chalk.bold('\n📊 By pattern:'));
        Object.entries(byPattern)
            .sort((a, b) => b[1] - a[1])
            .forEach(([pattern, count]) => {
                console.log(`   ${colors.terminal(pattern)}: ${count} occurrence${count > 1 ? 's' : ''}`);
            });
    };

    /**
     * Отрисовка статистики автомата
     * @param stats - статистика автомата
     */
    static renderStats = (stats: IAutomatonStats): void => {
        const table = new Table({
            style: { head: ['cyan'] },
            colWidths: [25, 30]
        });
        
        // Основные метрики
        table.push(
            { '📊 Total Patterns': stats.patternCount.toString() },
            { '🌳 Total Nodes': stats.nodeCount.toString() },
            { '📏 Max Depth': stats.maxDepth.toString() },
            { '🎯 Terminal Nodes': stats.terminalCount.toString() },
            { '🔧 Automaton Built': stats.built ? colors.success('Yes') : colors.warning('No') },
            { '📈 Avg Branching': (stats.nodeCount / Math.max(1, stats.maxDepth)).toFixed(2) }
        );
        
        console.log('\n' + chalk.bold('📈 AUTOMATON STATISTICS:'));
        console.log(colors.secondary('─'.repeat(60)));
        console.log(table.toString());
        
        // Список паттернов
        if (stats.patterns.length) {
            console.log(chalk.bold('\n📝 Pattern list:'));
            
            // Группировка по длине
            const byLength = stats.patterns.reduce((acc, p, i) => {
                const len = p.length;
                if (!acc[len]) acc[len] = [];
                acc[len].push(`[${i}] "${p}"`);
                return acc;
            }, {} as Record<number, string[]>);
            
            Object.entries(byLength)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .forEach(([len, patterns]) => {
                    console.log(`   ${chalk.bold(`Length ${len}:`)}`);
                    patterns.forEach(p => console.log(`     ${colors.node(p)}`));
                });
        }
    };

    /**
     * Отрисовка логов
     * @param logs - массив логов
     * @param limit - максимальное количество логов для отображения
     */
    static renderLogs = (logs: any[], limit: number = 15): void => {
        if (!logs.length) {
            console.log(colors.warning(`${symbols.warning} No logs available`));
            return;
        }

        console.log('\n' + chalk.bold('📋 RECENT LOGS:'));
        console.log(colors.secondary('─'.repeat(70)));
        
        const table = new Table({
            style: { head: ['gray'] },
            colWidths: [12, 10, 45]
        });
        
        table.push(['Time', 'Type', 'Message']);
        
        logs.slice(-limit).forEach(log => {
            const time = log.timestamp.toLocaleTimeString();
            const type = this.getLogColoredPrefix(log.type);
            const message = this.truncateMessage(log.message, 45);
            
            table.push([chalk.gray(time), type, message]);
        });
        
        console.log(table.toString());
        console.log(colors.gray(`\nShowing last ${Math.min(limit, logs.length)} of ${logs.length} logs`));
    };

    /**
     * Отрисовка сравнения производительности
     * @param naiveTime - время наивного алгоритма
     * @param acTime - время алгоритма Ахо-Корасик
     * @param textLength - длина текста
     * @param patternCount - количество паттернов
     */
    static renderPerformance = (
        naiveTime: number, 
        acTime: number, 
        textLength: number,
        patternCount: number
    ): void => {
        const speedup = (naiveTime / acTime).toFixed(2);
        
        const table = new Table({
            head: ['Algorithm', 'Time (ms)', 'Complexity', 'Speed'],
            style: { head: ['cyan'] }
        });
        
        table.push(
            ['Naive O(n*m)', naiveTime.toFixed(3), `O(${textLength}*${patternCount})`, '1x'],
            ['Aho-Corasick', acTime.toFixed(3), `O(${textLength}+total)`, `${speedup}x faster`]
        );
        
        console.log('\n' + chalk.bold('⚡ PERFORMANCE COMPARISON:'));
        console.log(colors.secondary('─'.repeat(60)));
        console.log(table.toString());
    };

    /**
     * Получение цветного префикса для типа лога
     */
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

    /**
     * Обрезание длинного сообщения
     */
    private static truncateMessage = (msg: string, maxLen: number): string => {
        if (msg.length <= maxLen) return msg;
        return msg.substring(0, maxLen - 3) + '...';
    };
}