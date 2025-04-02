import { createClient } from 'webdav';
import { FileService } from '../services/file.service.js';
import { FolderService } from '../services/folder.service.js';
/**
 * Основной класс для взаимодействия с Mail.Ru Cloud.
 */
export class MailRuCloud {
    /**
     * Конструктор класса MailRuCloud.
     * @param {MailRuAuth} auth - Объект аутентификации.
     */
    constructor({ username, password }) {
        this.client = createClient('https://webdav.cloud.mail.ru/', {
            username,
            password,
        });
        this.file = new FileService(this.client);
        this.folder = new FolderService(this.client);
    }
}
