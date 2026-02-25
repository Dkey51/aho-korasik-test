/**
 * Утилиты для работы со строками
 */
export class StringUtils {
    // Выделение подстроки в тексте
    static highlightSubstring = (text: string, start: number, end: number): string => {
        const before = text.substring(0, start);
        const matched = text.substring(start, end + 1);
        const after = text.substring(end + 1);
        
        return `${before}[${matched}]${after}`;
    };

    // Центрирование текста
    static center = (text: string, width: number): string => {
        const padding = Math.max(0, width - text.length);
        const left = Math.floor(padding / 2);
        const right = padding - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
    };

    // Обрезание текста до максимальной длины
    static truncate = (text: string, maxLength: number): string =>
        text.length > maxLength 
            ? text.substring(0, maxLength - 3) + '...' 
            : text;
}