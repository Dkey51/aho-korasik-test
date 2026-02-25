import { INode, IAutomaton, ISearchResult, IAutomatonStats } from './interfaces';
import { AhoCorasickNode } from './AhoCorasickNode';
import { TrieBuilder } from '../builder/TrieBuilder';
import { FailureLinkBuilder } from '../builder/FailureLinkBuilder';
import { logger } from '../../logger/Logger';

/**
 * Основной класс автомата Ахо-Корасик
 * Управляет построением и поиском
 */
export class AhoCorasickAutomaton implements IAutomaton {
    readonly root: INode;
    readonly patterns: string[];
    public built: boolean;

    constructor() {
        this.root = new AhoCorasickNode();
        this.patterns = [];
        this.built = false;
    }

    // Добавление паттерна
    addPattern = (pattern: string): void => {
        const index = this.patterns.length;
        TrieBuilder.insert(this.root, pattern, index);
        this.patterns.push(pattern);
        this.built = false;
        logger.success(`Pattern added: "${pattern}"`);
    };

    // Построение fail-ссылок
    buildFailureLinks = (): void => {
        if (!this.patterns.length) {
            logger.warning('No patterns to build');
            return;
        }

        FailureLinkBuilder.build(this.root);
        this.built = true;
        logger.success('Failure links built');
    };

    // Поиск в тексте
    search = (text: string): ISearchResult[] => {
        if (!this.built) {
            logger.warning('Building failure links automatically...');
            this.buildFailureLinks();
        }

        const results: ISearchResult[] = [];
        let node: INode = this.root;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // Переход по fail-ссылкам
            while (node !== this.root && !node.children.has(char)) {
                node = node.failLink!;
            }

            // Переход по символу
            node = node.children.get(char) ?? this.root;

            // Проверка найденных паттернов
            node.output.forEach(patternIndex => {
                const pattern = this.patterns[patternIndex];
                results.push({
                    pattern,
                    index: patternIndex,
                    position: i - pattern.length + 1,
                    endPosition: i
                });
            });
        }

        logger.info(`Found ${results.length} occurrences`);
        return results;
    };

    // Получение статистики
    getStats = (): IAutomatonStats => {
        const stats = TrieBuilder.collectStats(this.root);
        
        return {
            patternCount: this.patterns.length,
            nodeCount: stats.nodeCount,
            maxDepth: stats.maxDepth,
            terminalCount: stats.terminalCount,
            built: this.built,
            patterns: [...this.patterns]
        };
    };

    // Сброс автомата
    reset = (): void => {
        this.root.children.clear();
        this.patterns.length = 0;
        this.built = false;
        logger.info('Automaton reset');
    };
}