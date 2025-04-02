# 📦 mailru-cloud: Node.js Library for Mail.ru Cloud Storage via WebDAV API

mailru-cloud is a lightweight Node.js library that simplifies working with Mail.ru Cloud storage using the WebDAV API. It provides an easy-to-use interface for uploading, downloading, managing files, and organizing folders in your Mail.ru Cloud account.

## ✨ Features

- **File Management**: Upload, download, move, copy, delete, and search for files effortlessly.
- **Folder Operations**: Create, list, and delete directories with ease.
- **Secure Authentication**: Supports application-specific passwords for enhanced security.
- **Stream-based Data Handling**: Handles large files efficiently by utilizing streams.

## 🔑 How to Generate an Application Password

Before using the library, you'll need to generate an application-specific password for Mail.ru Cloud. Here's how:

1. Go to your [Mail.ru Account Security Settings](https://id.mail.ru/security).
2. Click "Пароли для внешних приложений" ("Passwords for external applications").
3. Add a descriptive name (e.g., "WebDAV Cloud").
4. Select "Полный доступ к Облаку (WebDAV)" ("Full access to Cloud (WebDAV)") for permission.
5. Copy the generated password—it will only appear once!
6. Use this password in your code.

## 🚀 Getting Started

Install the package using npm or yarn:

```bash
npm install mailru-cloud
# or
yarn add mailru-cloud
```

Import the library and initialize the client using `MailRuCloud`:

```typescript
import { MailRuCloud } from 'mailru-cloud'

const cloud = new MailRuCloud({
  username: 'your_email@mail.ru', // Full email address password: 'your_application_password', // Generated password
})
```

## 📥 Uploading Files

Use the `upload` method to upload files to your Mail.ru Cloud:

```typescript
import { createReadStream } from 'fs'

await cloud.file.upload(
  createReadStream('./local_file.txt'),
  '/cloud_directory/file.txt'
)
```

## 📤 Downloading Files

Download files from Mail.ru Cloud using the `download` method:

```typescript
import { createWriteStream } from 'fs'

const fileStream = await cloud.file.download('/cloud_directory/file.txt')
fileStream.pipe(createWriteStream('./downloaded_file.txt'))
```

## 🎯 Finding Files

The `find` method allows you to search for specific files based on their names, ETags, or other criteria. Both `filename` and `etag` parameters are optional, allowing flexible searches based on one or both criteria. Here's how to use it:

```typescript
const foundFile = await cloud.file.find({
  filename: 'example.txt', // Search by filename
  etag: '12345', // Optional: Search by ETag
  folderPath: '/cloud_directory/', // Specify the starting directory
  recursive: true, // Enable recursive search
  sensitive: false, // Case-insensitive search
})

console.log(foundFile) // Output the result
```

### Parameters

- **`filename`** (optional): The name of the file you're searching for. Can be combined with `etag` for precise searches.
- **`etag`** (optional): An ETag for the file, which can help identify the latest version. Can be used alone or together with `filename`.
- **`folderPath`** (default: `/`): The directory where the search starts.
- **`recursive`** (default: `false`): Whether to perform a recursive search through subdirectories.
- **`sensitive`** (default: `false`): Whether the search should be case-sensitive.

## 📋 Managing Files

### Moving Files

Move files within your Mail.ru Cloud using the `move` method:

```typescript
await cloud.file.move('/current_path/file.txt', '/new_path/file.txt')
```

### Copying Files

Copy files within your Mail.ru Cloud using the `copy` method:

```typescript
await cloud.file.copy('/original_path/file.txt', '/duplicate_path/file.txt')
```

### Deleting Files

Remove files from your Mail.ru Cloud using the `remove` method:

```typescript
await cloud.file.remove('/path_to_delete/file.txt')
```

## 🗂️ Managing Folders

### Creating Directories

Use the `create` method to create new directories:

```typescript
await cloud.folder.create('new_folder', '/parent_directory/')
```

### Listing Contents

List the contents of a directory using the `list` method:

```typescript
const folderContents = await cloud.folder.list('/parent_directory/')
console.log(folderContents)
```

### Deleting Directories

Delete directories recursively using the `delete` method:

```typescript
await cloud.folder.delete('/parent_directory/new_folder/')
```

## ❓ Troubleshooting

If you're experiencing issues with authentication or file operations, double-check that you've correctly generated and used your application-specific password. Also ensure that the paths specified are correct and that the requested actions align with the limitations imposed by Mail.ru Cloud's WebDAV API.

## 💻 License

This project is licensed under the MIT License—see the LICENSE file for more information.
