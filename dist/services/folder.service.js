/**
 * Класс для работы с директориями в облачном хранилище.
 */
export class FolderService {
    /**
     * Конструктор класса FolderService.
     * @param {WebDAVClient} client - Экземпляр WebDAV клиента.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Создание новой директории.
     * @param {string} folderName - Имя создаваемой директории.
     * @param {string} parentPath - Путь к родительской директории (по умолчанию корень).
     */
    async create(folderName, parentPath = '/') {
        try {
            await this.client.createDirectory(`${parentPath}/${folderName}`);
        }
        catch (error) {
            throw new Error(`Ошибка при создании директории: ${error.message}`);
        }
    }
    /**
     * Удаление директории (рекурсивное).
     * @param {string} folderPath - Путь к удаляемой директории.
     */
    async delete(folderPath) {
        try {
            const response = await this.client.getDirectoryContents(folderPath);
            const contents = Array.isArray(response) ? response : response.data;
            // Рекурсивно удаляем все файлы и подпапки
            for (const item of contents) {
                if (item.type === 'file') {
                    await this.client.deleteFile(item.filename);
                }
                else if (item.type === 'directory') {
                    await this.delete(item.filename);
                }
            }
            // Удаляем саму директорию
            await this.client.deleteFile(folderPath);
        }
        catch (error) {
            throw new Error(`Ошибка при удалении директории: ${error.message}`);
        }
    }
    /**
     * Получение содержимого директории.
     * @param {string} folderPath - Путь к директории.
     * @returns {Promise<FileStat[]>} - Содержимое директории.
     */
    async list(folderPath) {
        try {
            const contents = await this.client.getDirectoryContents(folderPath);
            return Array.isArray(contents) ? contents : contents.data;
        }
        catch (error) {
            throw new Error(`Ошибка при получении содержимого директории: ${error.message}`);
        }
    }
}
