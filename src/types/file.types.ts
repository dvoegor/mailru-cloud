export interface FindFileArgs {
  /** Имя файла или часть имени */
  filename?: string

  /** ETag для точного поиска */
  etag?: string

  /** Путь для поиска */
  folderPath?: string

  /** Рекурсивный поиск */
  recursive?: boolean

  /** Чувствительность к регистру имени */
  sensitive?: boolean
}
