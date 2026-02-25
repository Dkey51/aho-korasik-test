import { v4 as uuidv4 } from 'uuid';
import { INode } from './interfaces';

/**
 * Класс узла в автомате Ахо-Корасик
 * Каждый узел представляет состояние в автомате
 */
export class AhoCorasickNode implements INode {
    readonly id: string;
    readonly children: Map<string, INode>;
    public failLink: INode | null;
    public output: number[];
    readonly depth: number;
    readonly parent: INode | null;
    readonly edgeChar: string | null;

    constructor(parent: INode | null = null, edgeChar: string | null = null) {
        this.id = uuidv4().substring(0, 8);
        this.children = new Map();
        this.failLink = null;
        this.output = [];
        this.depth = (parent?.depth ?? -1) + 1;
        this.parent = parent;
        this.edgeChar = edgeChar;
    }

    // Проверка на корень
    isRoot = (): boolean => !this.parent;

    // Проверка на терминальный узел (конец паттерна)
    isTerminal = (): boolean => this.output.length > 0;
    
    // Получение пути от корня до узла
    getPath = (): string => {
        const path: string[] = [];
        let current: INode | null = this;
        
        while (current && !current.isRoot()) {
            if (current.edgeChar) path.unshift(current.edgeChar);
            current = current.parent;
        }
        
        return path.join('');
    };
}