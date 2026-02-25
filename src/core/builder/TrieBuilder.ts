import { INode } from '../automaton/interfaces';
import { AhoCorasickNode } from '../automaton/AhoCorasickNode';

/**
 * Построитель бора (префиксного дерева)
 * Отвечает только за вставку паттернов и сбор статистики
 */
export class TrieBuilder {
    // Вставка паттерна в бор
    static insert = (root: INode, pattern: string, index: number): INode => {
        let node = root;

        for (const char of pattern) {
            // Создаем узел, если его нет (тернарный оператор)
            const child = node.children.get(char) ?? 
                new AhoCorasickNode(node, char);
            
            // Добавляем в children, если это новый узел
            if (!node.children.has(char)) {
                node.children.set(char, child);
            }
            
            node = child;
        }

        // Помечаем терминальный узел
        node.output.push(index);
        return node;
    };

    // Сбор статистики о дереве
    static collectStats = (root: INode): any => ({
        nodeCount: this.countNodes(root),
        maxDepth: this.getMaxDepth(root),
        terminalCount: this.countTerminals(root)
    });

    // Подсчет количества узлов (рекурсивно)
    private static countNodes = (node: INode): number =>
        1 + [...node.children.values()]
            .reduce((sum, child) => sum + this.countNodes(child), 0);

    // Поиск максимальной глубины (рекурсивно)
    private static getMaxDepth = (node: INode, depth: number = 0): number =>
        node.children.size === 0 
            ? depth 
            : Math.max(depth, ...[...node.children.values()]
                .map(child => this.getMaxDepth(child, depth + 1)));

    // Подсчет терминальных узлов (рекурсивно)
    private static countTerminals = (node: INode): number =>
        (node.isTerminal() ? 1 : 0) + 
        [...node.children.values()]
            .reduce((sum, child) => sum + this.countTerminals(child), 0);
}