import { PassThrough } from 'stream';
/**
 * Класс для работы с файлами в облачном хранилище.
 */
export class FileService {
    /**
     * Конструктор класса FileService.
     * @param {WebDAVClient} client - Экземпляр WebDAV клиента.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Загружает файл в облачное хранилище.
     * @param {Readable} stream - Поток данных файла.
     * @param {string} destinationPath - Путь назначения в облачном хранилище.
     */
    async upload(stream, destinationPath) {
        try {
            await this.client.putFileContents(destinationPath, stream);
        }
        catch (error) {
            throw new Error(`Ошибка при загрузке файла: ${error.message}`);
        }
    }
    /**
     * Скачивает файл из облачного хранилища.
     * @param {string} remotePath - Путь к файлу в облачном хранилище.
     * @returns {Promise<Readable>} - Поток данных файла.
     */
    async download(remotePath) {
        try {
            const bufferOrString = await this.client.getFileContents(remotePath);
            // Создаем поток из полученного буфера или строки
            const passThroughStream = new PassThrough();
            passThroughStream.end(bufferOrString);
            return passThroughStream;
        }
        catch (error) {
            throw new Error(`Ошибка при скачивании файла: ${error.message}`);
        }
    }
    /**
     * Находит файл в облачном хранилище.
     * @param {FindFileArgs} args - Аргументы поиска файла.
     * @returns {Promise<FileStat|null>} - Найденный файл или null, если файл не найден.
     */
    async find({ filename, etag, folderPath = '/', recursive = false, sensitive = false, }) {
        try {
            const items = await this.getSafeDirectoryContents(folderPath);
            // Функция сравнения имени
            const nameMatches = (item) => {
                if (!filename)
                    return false;
                return sensitive
                    ? item.basename === filename
                    : item.basename.toLowerCase() === filename.toLowerCase();
            };
            // Функция сравнения ETag
            const etagMatches = (item) => {
                return etag && item.etag === etag;
            };
            // Поиск в текущей папке
            const foundItem = items.find((item) => item.type === 'file' && (nameMatches(item) || etagMatches(item)));
            if (foundItem)
                return foundItem;
            // Рекурсивный поиск
            if (recursive) {
                for (const item of items.filter((i) => i.type === 'directory')) {
                    const found = await this.find({
                        filename,
                        etag,
                        folderPath: item.filename,
                        recursive: true,
                        sensitive,
                    });
                    if (found)
                        return found;
                }
            }
            return null;
        }
        catch (error) {
            throw new Error(`Ошибка при поиске файла: ${error.message}`);
        }
    }
    /**
     * Перемещает файл в облачном хранилище.
     * @param {string} sourcePath - Исходный путь файла.
     * @param {string} targetPath - Целевой путь для перемещения файла.
     */
    async move(sourcePath, targetPath) {
        try {
            await this.client.moveFile(sourcePath, targetPath);
        }
        catch (error) {
            throw new Error(`Ошибка при перемещении файла: ${error.message}`);
        }
    }
    /**
     * Копирует файл в облачном хранилище.
     * @param {string} sourcePath - Исходный путь файла.
     * @param {string} targetPath - Целевой путь для копирования файла.
     */
    async copy(sourcePath, targetPath) {
        try {
            await this.client.copyFile(sourcePath, targetPath);
        }
        catch (error) {
            throw new Error(`Ошибка при копировании файла: ${error.message}`);
        }
    }
    /**
     * Удаляет файл из облачного хранилища.
     * @param {string} filePath - Путь к файлу, который нужно удалить.
     */
    async remove(filePath) {
        try {
            await this.client.deleteFile(filePath);
        }
        catch (error) {
            throw new Error(`Ошибка при удалении файла: ${error.message}`);
        }
    }
    /**
     * Безопасное получение содержимого директории.
     * @param {string} path - Путь к директории.
     * @returns {Promise<FileStat[]>} - Содержимое директории.
     */
    async getSafeDirectoryContents(path) {
        const response = await this.client.getDirectoryContents(path);
        return Array.isArray(response) ? response : response.data;
    }
}
