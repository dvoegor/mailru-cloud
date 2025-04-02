import { createClient, WebDAVClient } from 'webdav'
import { MailRuAuth } from '../types/client.types.js'
import { FileService } from '../services/file.service.js'
import { FolderService } from '../services/folder.service.js'

/**
 * Основной класс для взаимодействия с Mail.Ru Cloud.
 */
export class MailRuCloud {
  /**
   * Конструктор класса MailRuCloud.
   * @param {MailRuAuth} auth - Объект аутентификации.
   */
  constructor({ username, password }: MailRuAuth) {
    this.client = createClient('https://webdav.cloud.mail.ru/', {
      username,
      password,
    })
    this.file = new FileService(this.client)
    this.folder = new FolderService(this.client)
  }

  /** @type {WebDAVClient} */
  protected client: WebDAVClient

  /** @type {FileService} */
  public file: FileService

  /** @type {FolderService} */
  public folder: FolderService
}
