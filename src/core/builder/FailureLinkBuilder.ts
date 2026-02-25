import { INode } from '../automaton/interfaces';
import { logger } from '../../logger/Logger';

/**
 * Построитель fail-ссылок (суффиксных ссылок)
 * Использует BFS для обхода дерева
 */
export class FailureLinkBuilder {
    // Основной метод построения fail-ссылок
    static build = (root: INode): void => {
        const queue: INode[] = [];

        // Инициализация: дети корня ссылаются на корень
        root.children.forEach(child => {
            child.failLink = root;
            queue.push(child);
        });

        // BFS обход для построения остальных ссылок
        while (queue.length) {
            const current = queue.shift()!;
            
            current.children.forEach((child, char) => {
                // Поиск fail-ссылки для текущего ребенка
                const failNode = this.findFailNode(current, char) ?? root;
                
                child.failLink = failNode;
                child.output = [...child.output, ...failNode.output];
                queue.push(child);
                
                logger.debug(`Fail link: '${char}' → ${failNode.getPath() || 'root'}`);
            });
        }
    };

    // Поиск подходящей fail-ссылки
    private static findFailNode = (node: INode, char: string): INode | null => {
        let failNode = node.failLink;
        
        // Идем по fail-ссылкам пока не найдем переход
        while (failNode && !failNode.children.has(char)) {
            failNode = failNode.failLink;
        }
        
        // Возвращаем узел перехода или null
        return failNode?.children.get(char) ?? null;
    };
}