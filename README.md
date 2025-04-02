# mailru-cloud
📦 mailru-cloud: Node.js library for Mail.ru Cloud storage via WebDAV API – upload, download &amp; manage files with ease!

🔐 Как создать пароль для приложения (пошагово):
Зайдите в настройки безопасности
Откройте: https://account.mail.ru/user/2fa/app-passwords

Создайте новый пароль

Нажмите «Создать пароль для приложения»

Введите название (например, WebDAV Cloud)

Скопируйте сгенерированный пароль (он покажется только один раз!)

Используйте в коде

typescript
Copy
const client = createClient('https://webdav.cloud.mail.ru/', {
  username: 'your_email@mail.ru', // Полный email
  password: 'ваш_пароль_для_приложения' // Тот, что создали в настройках
});