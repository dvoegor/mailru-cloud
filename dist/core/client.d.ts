import { WebDAVClient } from 'webdav';
import { MailRuAuth } from '../types/client.types.js';
import { FileService } from '../services/file.service.js';
import { FolderService } from '../services/folder.service.js';
/**
 * Основной класс для взаимодействия с Mail.Ru Cloud.
 */
export declare class MailRuCloud {
    /**
     * Конструктор класса MailRuCloud.
     * @param {MailRuAuth} auth - Объект аутентификации.
     */
    constructor({ username, password }: MailRuAuth);
    /** @type {WebDAVClient} */
    protected client: WebDAVClient;
    /** @type {FileService} */
    file: FileService;
    /** @type {FolderService} */
    folder: FolderService;
}
