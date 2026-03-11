# Mini ChatGPT

## Как запускать

### 1) Установка

Из корня проекта:

```bash
npm run install:all
npm install
```

### 2) Переменные окружения

Создай `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

## Локальный запуск (Frontend + Express Backend)

Из корня проекта:

```bash
npm run dev
```

Открой:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Запуск в режиме Vercel (Serverless `/api/chat`)

1. Добавь переменную в `.env.local` (в корне):

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

2. Запусти:

```bash
npx vercel dev
```

Открой адрес, который покажет CLI (обычно `http://localhost:3000`).

## Сборка frontend

```bash
npm run build --prefix frontend
npm run preview --prefix frontend
```
