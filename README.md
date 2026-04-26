# LUXE — Интернет-магазин одежды и кроссовок

Полноценный React SPA интернет-магазин с авторизацией, корзиной, избранным, админ-панелью и CRUD для товаров.

## Технологии
- React 18 (функциональные компоненты + Hooks)
- React Router v6
- Recharts (графики)
- localStorage (хранение данных)
- CSS Variables (темизация)
- Google Fonts (Playfair Display + DM Sans)

## Страницы (10+)
| Маршрут | Страница |
|---|---|
| `/` | Главная |
| `/products` | Каталог с фильтрами, поиском, сортировкой |
| `/products/:id` | Детали товара |
| `/products/create` | Создание товара (admin) |
| `/products/:id/edit` | Редактирование товара (admin) |
| `/login` | Вход |
| `/register` | Регистрация |
| `/dashboard` | Дашборд пользователя |
| `/profile` | Профиль |
| `/cart` | Корзина |
| `/wishlist` | Избранное |
| `/orders` | Заказы |
| `/admin` | Админ панель |
| `*` | 404 |

## Тестовые аккаунты
- **Admin:** admin@luxe.com / admin123
- **User:** user@luxe.com / user123

## Бренды
Nike, Adidas, Louis Vuitton, Puma, Polo Ralph Lauren, Balenciaga, Tommy Hilfiger, Paul & Shark, Gucci, Off-White, Stone Island, Moncler, New Balance, Converse, Lacoste

## Установка и запуск

```bash
cd fashion-store
npm install
npm start
```

Откроется http://localhost:3000

## Деплой на Vercel / Netlify

```bash
npm run build
# загрузить папку build/ на Vercel/Netlify
```

Для корректной работы роутинга на Netlify создать файл `public/_redirects`:
```
/* /index.html 200
```

## Функционал
- ✅ 10+ страниц
- ✅ React Router (базовые, динамические, защищённые маршруты)
- ✅ Авторизация (login/register/logout, роли admin/user)
- ✅ CRUD товаров (создание, редактирование, удаление)
- ✅ Корзина с localStorage
- ✅ Избранное
- ✅ Поиск + фильтрация + сортировка
- ✅ Валидация форм
- ✅ Состояния: загрузка, ошибка, пустое состояние
- ✅ Toast уведомления
- ✅ Графики (Recharts)
- ✅ Адаптивная верстка
- ✅ 20 товаров, 15 брендов, 8 категорий
- ✅ Мужской / Женский / Унисекс
- ✅ Выбор размеров одежды и обуви
