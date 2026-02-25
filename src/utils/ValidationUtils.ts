/**
 * Утилиты для валидации
 */
export class ValidationUtils {
    // Проверка на пустую строку
    static isNotEmpty = (str: string): boolean => str.trim().length > 0;

    // Проверка на допустимые символы (только буквы и цифры)
    static isValidPattern = (pattern: string): boolean => 
        /^[a-zA-Z0-9]+$/.test(pattern);

    // Получение сообщения об ошибке
    static getErrorMessage = (error: unknown): string =>
        error instanceof Error ? error.message : String(error);
}