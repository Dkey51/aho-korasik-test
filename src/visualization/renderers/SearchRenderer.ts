import chalk from 'chalk';
import { INode, ISearchResult } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для пошагового отображения поиска
 * Отвечает за визуализацию процесса поиска в реальном времени
 */
export class SearchRenderer {
    private static lastStepLength = 0;

    /**
     * Отрисовка текущего шага поиска
     * @param text - исходный текст
     * @param position - текущая позиция
     * @param node - текущий узел
     * @param found - найденные на этом шаге паттерны
     */
    static renderStep = (
        text: string, 
        position: number, 
        node: INode, 
        found: ISearchResult[]
    ): void => {
        // Очищаем предыдущий шаг (если нужно)
        this.clearStep();
        
        const char = text[position] ?? '';
        const before = text.substring(0, position);
        const after = text.substring(position + 1);
        
        const lines: string[] = [
            colors.secondary('┄'.repeat(60)),
            this.formatTextLine(before, char, after, position),
            this.formatPositionLine(position, text.length),
            this.formatNodeInfo(node),
        ];

        // Добавляем информацию о fail-ссылке
        if (node.failLink && node.failLink !== node.parent) {
            lines.push(this.formatFailLink(node));
        }

        // Добавляем найденные паттерны
        if (found.length) {
            lines.push(this.formatFoundPatterns(found));
        }

        // Добавляем подсказки для следующих шагов
        if (node.children.size > 0) {
            lines.push(this.formatNextChars(node));
        }

        const output = lines.join('\n');
        console.log(output);
        this.lastStepLength = output.split('\n').length;
    };

    /**
     * Очистка предыдущего шага (опционально)
     */
    private static clearStep = (): void => {
        if (this.lastStepLength > 0) {
            // Можно добавить очистку консоли или перемещение курсора
            // process.stdout.write('\x1b[' + this.lastStepLength + 'A'); // Поднять курсор вверх
        }
    };

    /**
     * Форматирование строки с текстом и подсветкой текущего символа
     */
    private static formatTextLine = (before: string, current: string, after: string, pos: number): string => {
        const text = `${before}${colors.current(current)}${after}`;
        const pointer = ' '.repeat(before.length) + colors.warning('↑');
        
        return `${chalk.bold('📄 Text:')}    ${text}\n` +
               `             ${pointer} pos ${pos}`;
    };

    /**
     * Форматирование информации о позиции
     */
    private static formatPositionLine = (pos: number, total: number): string => {
        const progress = Math.round((pos + 1) / total * 100);
        const progressBar = this.getProgressBar(progress, 20);
        
        return `${chalk.bold('📍 Position:')} ${pos} (${pos + 1}/${total}) ${progressBar} ${progress}%`;
    };

    /**
     * Форматирование информации о текущем узле
     */
    private static formatNodeInfo = (node: INode): string => {
        const path = node.getPath() || 'root';
        const depth = node.depth;
        const terminal = node.isTerminal() ? colors.terminal(` ${symbols.terminal}`) : '';
        
        return `${chalk.bold('🔄 State:')}    ${colors.node(path)}${terminal} (depth: ${depth})`;
    };

    /**
     * Форматирование информации о fail-ссылке
     */
    private static formatFailLink = (node: INode): string => {
        const failPath = node.failLink?.getPath() || 'root';
        const isTerminal = node.failLink?.isTerminal() ? colors.terminal(` ${symbols.terminal}`) : '';
        
        return `${chalk.bold('↯ Fail:')}     ${colors.failLink(failPath)}${isTerminal}`;
    };

    /**
     * Форматирование найденных паттернов
     */
    private static formatFoundPatterns = (found: ISearchResult[]): string => {
        const patterns = found.map(f => 
            colors.terminal(`"${f.pattern}"`) + chalk.gray(`@${f.position}`)
        ).join(', ');
        
        return `${chalk.bold('✅ Found:')}    ${patterns}`;
    };

    /**
     * Форматирование подсказки о следующих возможных символах
     */
    private static formatNextChars = (node: INode): string => {
        const nextChars = [...node.children.keys()]
            .map(c => colors.node(`'${c}'`))
            .join(' ');
        
        return `${chalk.bold('🔮 Next:')}     ${nextChars}`;
    };

    /**
     * Создание прогресс-бара
     */
    private static getProgressBar = (percent: number, length: number): string => {
        const filled = Math.round(percent / 100 * length);
        const empty = length - filled;
        
        const filledBar = colors.success('█'.repeat(filled));
        const emptyBar = colors.debug('░'.repeat(empty));
        
        return filledBar + emptyBar;
    };

    /**
     * Отрисовка финальных результатов
     * @param results - все найденные паттерны
     */
    static renderFinalResults = (results: ISearchResult[]): void => {
        console.log('\n' + colors.secondary('═'.repeat(60)));
        console.log(chalk.bold('🏁 SEARCH COMPLETED'));
        console.log(colors.secondary('─'.repeat(60)));

        if (!results.length) {
            console.log(colors.warning(`${symbols.warning} No patterns found`));
            return;
        }

        // Группировка по позициям
        const byPosition = results.reduce((acc, r) => {
            if (!acc[r.position]) acc[r.position] = [];
            acc[r.position].push(r);
            return acc;
        }, {} as Record<number, ISearchResult[]>);

        // Сортировка по позициям
        Object.entries(byPosition)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .forEach(([pos, matches]) => {
                const patterns = matches
                    .map(m => colors.terminal(`"${m.pattern}"`))
                    .join(', ');
                console.log(`  ${chalk.bold(`@${pos}:`)} ${patterns}`);
            });

        console.log(colors.secondary('─'.repeat(60)));
        console.log(colors.success(`${symbols.success} Total: ${results.length} occurrence${results.length > 1 ? 's' : ''}`));
    };

    /**
     * Отрисовка сообщения об отсутствии результатов
     */
    static renderNoResults = (): void => {
        console.log(colors.warning(`\n${symbols.warning} No patterns found`));
    };

    /**
     * Отрисовка начала поиска
     * @param text - текст для поиска
     */
    static renderSearchStart = (text: string): void => {
        console.log('\n' + chalk.bold('🔍 SEARCHING...'));
        console.log(colors.secondary(`Text: "${text}" (${text.length} chars)`));
        console.log(colors.secondary('─'.repeat(60)));
    };
}