// Базовые типы и интерфейсы для автомата Ахо-Корасик

// Типы для логирования
export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export interface ILogEntry {
    timestamp: Date;
    type: LogLevel;
    message: string;
    data?: any;
}

// Интерфейс узла автомата
export interface INode {
    readonly id: string;
    readonly children: Map<string, INode>;
    failLink: INode | null;
    output: number[];
    readonly depth: number;
    readonly parent: INode | null;
    readonly edgeChar: string | null;
    
    isRoot(): boolean;
    isTerminal(): boolean;
    getPath(): string;
}

// Интерфейс автомата
export interface IAutomaton {
    readonly root: INode;
    readonly patterns: string[];
    readonly built: boolean;
    
    addPattern(pattern: string): void;
    buildFailureLinks(): void;
    search(text: string): ISearchResult[];
    getStats(): IAutomatonStats;
    reset(): void;
}

// Результат поиска
export interface ISearchResult {
    pattern: string;
    index: number;
    position: number;
    endPosition: number;
}

// Статистика автомата
export interface IAutomatonStats {
    patternCount: number;
    nodeCount: number;
    maxDepth: number;
    terminalCount: number;
    built: boolean;
    patterns: string[];
}