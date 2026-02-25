import chalk from 'chalk';
import { INode } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для отображения дерева (бора)
 */
export class TreeRenderer {
    private static patterns: string[] = [];

    // Основной метод отрисовки дерева
    static render = (root: INode, patterns: string[]): void => {
        this.patterns = patterns;
        
        console.log('\n' + colors.title('🌳 AHO-CORASICK AUTOMATON'));
        console.log(colors.secondary('═'.repeat(50)));
        
        // Рекурсивная отрисовка
        this.printNode(root, '', true, new Set());
        
        // Легенда
        this.printLegend();
    };

    // Рекурсивная печать узла
    private static printNode = (
        node: INode, 
        prefix: string, 
        isLast: boolean,
        visited: Set<string>
    ): void => {
        // Защита от циклов
        if (visited.has(node.id)) return;
        visited.add(node.id);

        // Выбор символа и цвета для узла
        const nodeSymbol = node.isRoot() ? symbols.root : symbols.node;
        const nodeColor = node.isRoot() 
            ? colors.root 
            : node.isTerminal() 
                ? colors.terminal 
                : colors.node;

        // Информация об узле
        const nodeInfo = this.getNodeInfo(node);
        
        console.log(prefix + (isLast ? symbols.lastBranch : symbols.branch) + 
                   nodeColor(` ${nodeSymbol} ${nodeInfo}`));

        // Рекурсивный вывод детей
        const children = Array.from(node.children.entries());
        children.forEach(([char, child], i) => {
            const isLastChild = i === children.length - 1;
            
            // Показываем fail-ссылку если есть
            if (child.failLink) {
                const failPath = child.failLink.getPath() || 'root';
                console.log(prefix + (isLastChild ? '    ' : `${symbols.vertical}   `) + 
                           colors.failLink(`${symbols.fail} → ${failPath}`));
            }
            
            this.printNode(
                child, 
                prefix + (isLastChild ? '    ' : `${symbols.vertical}   `), 
                isLastChild, 
                new Set(visited)
            );
        });
    };

    // Получение информации об узле
    private static getNodeInfo = (node: INode): string => {
        const parts: string[] = [];
        
        // Путь к узлу
        if (!node.isRoot()) {
            parts.push(chalk.white(node.getPath()));
        }
        
        // Терминальные паттерны
        if (node.isTerminal()) {
            const patterns = node.output.map(i => `"${this.patterns[i]}"`).join(', ');
            parts.push(colors.terminal(`${symbols.terminal} ${patterns}`));
        }
        
        return parts.length ? parts.join(' ') : '';
    };

    // Печать легенды
    private static printLegend = (): void => {
        console.log('\n' + colors.secondary('═'.repeat(50)));
        console.log(chalk.bold('📋 LEGEND:'));
        console.log(`  ${colors.root(symbols.root)} - Root`);
        console.log(`  ${colors.terminal(symbols.terminal)} - Terminal (pattern end)`);
        console.log(`  ${colors.failLink(symbols.fail)} - Failure link`);
        console.log(`  ${colors.node(symbols.node)} - Regular node`);
    };
}