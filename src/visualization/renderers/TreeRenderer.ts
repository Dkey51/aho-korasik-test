import chalk from 'chalk';
import { INode } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для отображения дерева (бора)
 * Отвечает за визуализацию структуры автомата Ахо-Корасик
 */
export class TreeRenderer {
    private static patterns: string[] = [];
    private static visitedNodes = new Set<string>();

    /**
     * Основной метод отрисовки дерева
     * @param root - корневой узел автомата
     * @param patterns - массив паттернов для отображения в терминальных узлах
     */
    static render = (root: INode, patterns: string[]): void => {
        this.patterns = patterns;
        this.visitedNodes.clear();
        
        console.log('\n' + colors.title('🌳 AHO-CORASICK AUTOMATON'));
        console.log(colors.secondary('═'.repeat(50)));
        
        // Отрисовка корня
        console.log(colors.root('◆ root'));
        
        // Рекурсивная отрисовка детей корня
        const rootChildren = Array.from(root.children.entries());
        rootChildren.forEach(([_, child], index) => {
            const isLast = index === rootChildren.length - 1;
            this.printNode(child, '', isLast);
        });
        
        this.printLegend();
    };

    /**
     * Рекурсивная печать узла и его поддерева
     * @param node - текущий узел
     * @param prefix - префикс для отступов
     * @param isLast - является ли узел последним ребенком своего родителя
     */
    private static printNode = (
        node: INode, 
        prefix: string, 
        isLast: boolean
    ): void => {
        // Защита от циклов
        if (this.visitedNodes.has(node.id)) {
            console.log(prefix + (isLast ? symbols.lastBranch : symbols.branch) + 
                       colors.warning(` ${symbols.warning} already shown`));
            return;
        }
        
        this.visitedNodes.add(node.id);

        // Выбор символа и цвета для узла
        const nodeSymbol = symbols.node;
        const nodeColor = node.isTerminal() ? colors.terminal : colors.node;

        // Информация об узле
        const nodeInfo = this.getNodeInfo(node);
        
        // Вывод текущего узла
        console.log(prefix + (isLast ? symbols.lastBranch : symbols.branch) + 
                   nodeColor(` ${nodeSymbol} ${nodeInfo}`));

        // Показываем fail-ссылку, если она есть и ведет не в корень
        this.printFailLink(node, prefix, isLast);

        // Рекурсивный вывод детей
        const children = Array.from(node.children.entries());
        children.forEach(([_, child], index) => {
            const isLastChild = index === children.length - 1;
            
            this.printNode(
                child, 
                prefix + (isLastChild ? '    ' : `${symbols.vertical}   `), 
                isLastChild
            );
        });
    };

    /**
     * Отображение fail-ссылки для узла
     * @param node - текущий узел
     * @param prefix - префикс для отступов
     * @param isLast - является ли узел последним
     */
    private static printFailLink = (node: INode, prefix: string, isLast: boolean): void => {
        if (!node.failLink || node.isRoot()) return;
        
        const failPath = node.failLink.getPath() || 'root';
        const indent = prefix + (isLast ? '    ' : `${symbols.vertical}   `);
        
        // Показываем fail-ссылку только если она ведет не в родителя
        if (node.failLink !== node.parent) {
            console.log(indent + colors.failLink(`${symbols.fail} → ${failPath}`));
        }
    };

    /**
     * Формирование информации об узле
     * @param node - узел для анализа
     * @returns строка с информацией об узле
     */
    private static getNodeInfo = (node: INode): string => {
        const parts: string[] = [];
        
        // Показываем символ перехода
        if (node.edgeChar) {
            parts.push(chalk.white(node.edgeChar));
        }
        
        // Показываем полный путь в скобках
        const path = node.getPath();
        if (path && path.length > 0) {
            parts.push(chalk.gray(`[${path}]`));
        }
        
        // Терминальные паттерны
        if (node.isTerminal()) {
            const patterns = node.output
                .map(i => `"${this.patterns[i]}"`)
                .join(', ');
            parts.push(colors.terminal(`${symbols.terminal} ${patterns}`));
        }
        
        // Краткая информация о fail-ссылке
        if (node.failLink && !node.isRoot() && node.failLink !== node.parent) {
            const failPath = node.failLink.getPath() || 'root';
            parts.push(colors.failLink(`↯${failPath}`));
        }
        
        return parts.length ? parts.join(' ') : '';
    };

    /**
     * Печать легенды
     */
    private static printLegend = (): void => {
        console.log('\n' + colors.secondary('═'.repeat(50)));
        console.log(chalk.bold('📋 LEGEND:'));
        console.log(`  ${colors.root('◆')} - Root node`);
        console.log(`  ${colors.terminal('● ★')} - Terminal node with pattern(s)`);
        console.log(`  ${colors.node('●')} - Regular node`);
        console.log(`  ${colors.failLink('↯')} - Failure link`);
        console.log(`  ${colors.warning('⚠')} - Node shown elsewhere`);
        console.log(`  [path] - Full path from root`);
    };

    /**
     * Отладочная функция для анализа конкретного узла
     * @param root - корневой узел
     * @param targetPath - путь к узлу для анализа
     */
    static debugNode = (root: INode, targetPath: string): void => {
        const findNode = (node: INode, path: string): INode | null => {
            if (node.getPath() === path) return node;
            
            for (const child of node.children.values()) {
                const found = findNode(child, path);
                if (found) return found;
            }
            
            return null;
        };

        const node = findNode(root, targetPath);
        
        if (!node) {
            console.log(colors.warning(`\n${symbols.warning} Node with path "${targetPath}" not found`));
            return;
        }

        console.log('\n' + chalk.bold(`🔍 DEBUG NODE: "${targetPath}"`));
        console.log(colors.secondary('─'.repeat(40)));
        console.log(`  ID: ${chalk.gray(node.id)}`);
        console.log(`  Depth: ${node.depth}`);
        console.log(`  Edge char: ${node.edgeChar ? chalk.white(`'${node.edgeChar}'`) : 'none'}`);
        console.log(`  Is terminal: ${node.isTerminal() ? colors.success('yes') : colors.debug('no')}`);
        
        if (node.isTerminal()) {
            const patterns = node.output.map(i => `"${this.patterns[i]}"`).join(', ');
            console.log(`  Patterns: ${colors.terminal(patterns)}`);
        }
        
        console.log(`  Children: ${node.children.size ? 
            [...node.children.keys()].map(c => chalk.white(`'${c}'`)).join(', ') : 
            colors.debug('none')}`);
        
        console.log(`  Fail link: ${node.failLink ? 
            colors.failLink(node.failLink.getPath() || 'root') : 
            colors.debug('none')}`);
        
        if (node.failLink?.isTerminal()) {
            const failPatterns = node.failLink.output.map(i => `"${this.patterns[i]}"`).join(', ');
            console.log(`    ↳ terminal patterns: ${colors.terminal(failPatterns)}`);
        }
        
        console.log(colors.secondary('─'.repeat(40)));
    };
}