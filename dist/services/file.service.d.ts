import { WebDAVClient, FileStat } from 'webdav';
import { Readable } from 'stream';
import { FindFileArgs } from '../types/file.types.js';
/**
 * Класс для работы с файлами в облачном хранилище.
 */
export declare class FileService {
    protected readonly client: WebDAVClient;
    /**
     * Конструктор класса FileService.
     * @param {WebDAVClient} client - Экземпляр WebDAV клиента.
     */
    constructor(client: WebDAVClient);
    /**
     * Загружает файл в облачное хранилище.
     * @param {Readable} stream - Поток данных файла.
     * @param {string} destinationPath - Путь назначения в облачном хранилище.
     */
    upload(stream: Readable, destinationPath: string): Promise<void>;
    /**
     * Скачивает файл из облачного хранилища.
     * @param {string} remotePath - Путь к файлу в облачном хранилище.
     * @returns {Promise<Readable>} - Поток данных файла.
     */
    download(remotePath: string): Promise<Readable>;
    /**
     * Находит файл в облачном хранилище.
     * @param {FindFileArgs} args - Аргументы поиска файла.
     * @returns {Promise<FileStat|null>} - Найденный файл или null, если файл не найден.
     */
    find({ filename, etag, folderPath, recursive, sensitive, }: FindFileArgs): Promise<FileStat | null>;
    /**
     * Перемещает файл в облачном хранилище.
     * @param {string} sourcePath - Исходный путь файла.
     * @param {string} targetPath - Целевой путь для перемещения файла.
     */
    move(sourcePath: string, targetPath: string): Promise<void>;
    /**
     * Копирует файл в облачном хранилище.
     * @param {string} sourcePath - Исходный путь файла.
     * @param {string} targetPath - Целевой путь для копирования файла.
     */
    copy(sourcePath: string, targetPath: string): Promise<void>;
    /**
     * Удаляет файл из облачного хранилища.
     * @param {string} filePath - Путь к файлу, который нужно удалить.
     */
    remove(filePath: string): Promise<void>;
    /**
     * Безопасное получение содержимого директории.
     * @param {string} path - Путь к директории.
     * @returns {Promise<FileStat[]>} - Содержимое директории.
     */
    private getSafeDirectoryContents;
}
