import { WebDAVClient, FileStat } from 'webdav';
/**
 * Класс для работы с директориями в облачном хранилище.
 */
export declare class FolderService {
    protected readonly client: WebDAVClient;
    /**
     * Конструктор класса FolderService.
     * @param {WebDAVClient} client - Экземпляр WebDAV клиента.
     */
    constructor(client: WebDAVClient);
    /**
     * Создание новой директории.
     * @param {string} folderName - Имя создаваемой директории.
     * @param {string} parentPath - Путь к родительской директории (по умолчанию корень).
     */
    create(folderName: string, parentPath?: string): Promise<void>;
    /**
     * Удаление директории (рекурсивное).
     * @param {string} folderPath - Путь к удаляемой директории.
     */
    delete(folderPath: string): Promise<void>;
    /**
     * Получение содержимого директории.
     * @param {string} folderPath - Путь к директории.
     * @returns {Promise<FileStat[]>} - Содержимое директории.
     */
    list(folderPath: string): Promise<FileStat[]>;
}
