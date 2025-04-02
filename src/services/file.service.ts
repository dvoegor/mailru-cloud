import { WebDAVClient, FileStat } from 'webdav'
import { PassThrough, Readable } from 'stream'
import { FindFileArgs } from '../types/file.types.js'

/**
 * Класс для работы с файлами в облачном хранилище.
 */
export class FileService {
  /**
   * Конструктор класса FileService.
   * @param {WebDAVClient} client - Экземпляр WebDAV клиента.
   */
  constructor(protected readonly client: WebDAVClient) {}

  /**
   * Загружает файл в облачное хранилище.
   * @param {Readable} stream - Поток данных файла.
   * @param {string} destinationPath - Путь назначения в облачном хранилище.
   */
  async upload(stream: Readable, destinationPath: string) {
    try {
      await this.client.putFileContents(destinationPath, stream)
    } catch (error) {
      throw new Error(`Ошибка при загрузке файла: ${(error as Error).message}`)
    }
  }

  /**
   * Скачивает файл из облачного хранилища.
   * @param {string} remotePath - Путь к файлу в облачном хранилище.
   * @returns {Promise<Readable>} - Поток данных файла.
   */
  async download(remotePath: string): Promise<Readable> {
    try {
      const bufferOrString = await this.client.getFileContents(remotePath)

      // Создаем поток из полученного буфера или строки
      const passThroughStream = new PassThrough()
      passThroughStream.end(bufferOrString)

      return passThroughStream
    } catch (error) {
      throw new Error(
        `Ошибка при скачивании файла: ${(error as Error).message}`
      )
    }
  }

  /**
   * Находит файл в облачном хранилище.
   * @param {FindFileArgs} args - Аргументы поиска файла.
   * @returns {Promise<FileStat|null>} - Найденный файл или null, если файл не найден.
   */
  async find({
    filename,
    etag,
    folderPath = '/',
    recursive = false,
    sensitive = false,
  }: FindFileArgs): Promise<FileStat | null> {
    try {
      const items = await this.getSafeDirectoryContents(folderPath)

      // Функция сравнения имени
      const nameMatches = (item: FileStat) => {
        if (!filename) return false
        return sensitive
          ? item.basename === filename
          : item.basename.toLowerCase() === filename.toLowerCase()
      }

      // Функция сравнения ETag
      const etagMatches = (item: FileStat) => {
        return etag && item.etag === etag
      }

      // Поиск в текущей папке
      const foundItem = items.find(
        (item) =>
          item.type === 'file' && (nameMatches(item) || etagMatches(item))
      )

      if (foundItem) return foundItem

      // Рекурсивный поиск
      if (recursive) {
        for (const item of items.filter((i) => i.type === 'directory')) {
          const found = await this.find({
            filename,
            etag,
            folderPath: item.filename,
            recursive: true,
            sensitive,
          })
          if (found) return found
        }
      }

      return null
    } catch (error) {
      throw new Error(`Ошибка при поиске файла: ${(error as Error).message}`)
    }
  }

  /**
   * Перемещает файл в облачном хранилище.
   * @param {string} sourcePath - Исходный путь файла.
   * @param {string} targetPath - Целевой путь для перемещения файла.
   */
  async move(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await this.client.moveFile(sourcePath, targetPath)
    } catch (error) {
      throw new Error(
        `Ошибка при перемещении файла: ${(error as Error).message}`
      )
    }
  }

  /**
   * Копирует файл в облачном хранилище.
   * @param {string} sourcePath - Исходный путь файла.
   * @param {string} targetPath - Целевой путь для копирования файла.
   */
  async copy(sourcePath: string, targetPath: string): Promise<void> {
    try {
      await this.client.copyFile(sourcePath, targetPath)
    } catch (error) {
      throw new Error(
        `Ошибка при копировании файла: ${(error as Error).message}`
      )
    }
  }

  /**
   * Удаляет файл из облачного хранилища.
   * @param {string} filePath - Путь к файлу, который нужно удалить.
   */
  async remove(filePath: string): Promise<void> {
    try {
      await this.client.deleteFile(filePath)
    } catch (error) {
      throw new Error(`Ошибка при удалении файла: ${(error as Error).message}`)
    }
  }

  /**
   * Безопасное получение содержимого директории.
   * @param {string} path - Путь к директории.
   * @returns {Promise<FileStat[]>} - Содержимое директории.
   */
  private async getSafeDirectoryContents(path: string): Promise<FileStat[]> {
    const response = await this.client.getDirectoryContents(path)
    return Array.isArray(response) ? response : response.data
  }
}
