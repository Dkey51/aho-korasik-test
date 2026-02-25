import chalk from 'chalk';
import gradient from 'gradient-string';

/**
 * Интерфейс темы оформления
 */
export interface ITheme {
    // Основные цвета
    primary: chalk.Chalk;
    secondary: chalk.Chalk;
    success: chalk.Chalk;
    warning: chalk.Chalk;
    error: chalk.Chalk;
    info: chalk.Chalk;
    debug: chalk.Chalk;
    
    // Специальные для визуализации
    node: chalk.Chalk;
    edge: chalk.Chalk;
    root: chalk.Chalk;
    terminal: chalk.Chalk;
    failLink: chalk.Chalk;
    current: chalk.Chalk;
    
    // Градиенты
    title: gradient.Gradient;
    stats: gradient.Gradient;
}

/**
 * Символы для визуализации
 */
export interface ISymbols {
    node: string;
    root: string;
    edge: string;
    branch: string;
    lastBranch: string;
    vertical: string;
    horizontal: string;
    fail: string;
    terminal: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    arrow: string;
}