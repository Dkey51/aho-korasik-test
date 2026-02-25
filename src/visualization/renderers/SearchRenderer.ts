import chalk from 'chalk';
import { INode } from '../../core/automaton/interfaces';
import { colors, symbols } from '../themes/DefaultTheme';

/**
 * Рендерер для пошагового отображения поиска
 */
export class SearchRenderer {
    // Отрисовка текущего шага поиска
    static renderStep = (
        text: string, 
        position: number, 
        node: INode, 
        found: any[]
    ): void => {
        const char = text[position] ?? '';
        const before = text.substring(0, position);
        const after = text.substring(position + 1);
        
        const lines = [
            chalk.gray('─'.repeat(60)),
            `${chalk.bold('📄 Text:')} ${before}${colors.current(char)}${after}`,
            `${chalk.bold('📍 Position:')} ${position} (${position + 1}/${text.length})`,
            `${chalk.bold('🔄 Path:')} ${colors.node(node.getPath() || 'root')}`
        ];

        // Добавляем найденные паттерны
        if (found.length) {
            const foundStr = found.map(f => 
                colors.success(`"${f.pattern}"@${f.position}`)).join(', ');
            lines.push(`${chalk.bold('✅ Found:')} ${foundStr}`);
        }

        // Добавляем fail-ссылку
        if (node.failLink) {
            const failPath = node.failLink.getPath() || 'root';
            lines.push(`${chalk.bold('↯ Fail:')} ${colors.failLink(failPath)}`);
        }

        console.log(lines.join('\n'));
    };

    // Сообщение об отсутствии результатов
    static renderNoResults = (): void => {
        console.log(colors.warning(`\n${symbols.warning} No patterns found`));
    };
}