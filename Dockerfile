# Используем образ Node.js
FROM node:20-alpine

# Устанавливаем рабочую директорию — внутри app/
WORKDIR /app/app

# Копируем весь проект внутрь контейнера в /app
COPY . /app

# Устанавливаем зависимости (из /app/app)
RUN npm install

# Сборка TypeScript
RUN npm run build

# Переменные окружения
ENV NODE_ENV=production
ENV REPO_PATH=./repo

# Запуск
CMD ["node", "dist/server.js"]
