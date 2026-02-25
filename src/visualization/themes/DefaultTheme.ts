import chalk from 'chalk';
import gradient from 'gradient-string';
import { ITheme, ISymbols } from './Theme';

// Стандартная цветовая тема
export const colors: ITheme = {
    primary: chalk.cyan,
    secondary: chalk.magenta,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red,
    info: chalk.blue,
    debug: chalk.gray,
    
    node: chalk.cyan,
    edge: chalk.gray,
    root: chalk.yellow.bold,
    terminal: chalk.green.bold,
    failLink: chalk.red,
    current: chalk.bgCyan.black,
    
    title: gradient(['cyan', 'magenta', 'blue']),
    stats: gradient(['green', 'yellow']),
};

// Символы для ASCII-арта
export const symbols: ISymbols = {
    node: '●',
    root: '◆',
    edge: '│',
    branch: '├──',
    lastBranch: '└──',
    vertical: '│',
    horizontal: '─',
    fail: '↯',
    terminal: '★',
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    arrow: '→',
};
