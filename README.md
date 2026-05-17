# RepEdu — Платформа для работы репетиторов

Веб-ориентированная информационная система для поиска репетиторов и организации учебного процесса.

---

## Стек технологий

| Слой | Технологии |
|---|---|
| Backend | Java 21, Spring Boot 4.0.6, Spring Security (JWT), Spring Data JPA, Hibernate |
| База данных | PostgreSQL 16 |
| Frontend | HTML5, Tailwind CSS, JavaScript, FullCalendar 6 |
| Документация API | Springdoc OpenAPI (Swagger UI) |
| Контейнеризация | Docker, Docker Compose, Nginx |

---

## Функциональность

### Для студентов
- Регистрация и авторизация (JWT)
- Поиск репетиторов по городу, предмету
- Фильтрация по цене и рейтингу (слайдер 1.0–5.0)
- Просмотр профиля репетитора: фото, биография, предметы, контакты, отзывы
- Запись на урок через расписание
- Личный кабинет: записи, прогресс по предметам, учебные материалы, сообщения

### Для репетиторов
- Регистрация с профилем репетитора
- Управление профилем: биография, фото, цена, предметы, контакты
- Расписание с FullCalendar: добавление/удаление свободных слотов
- Управление записями учеников (подтверждение, завершение)
- Загрузка учебных материалов для студентов
- Статистика: уроков проведено, рейтинг, распределение оценок
- Внутренняя переписка со студентами

### Общее
- **Города**: 15 крупных городов России
- **Предметы**: все предметы ОГЭ/ЕГЭ (16 предметов)
- **Отзывы**: рейтинг 1–5, перерасчёт среднего при каждом новом отзыве
- **Связь**: внутренняя система сообщений (REST, хранение в БД)

---

## Структура проекта

```
C:\Els_Lew\
├── Els_Lew_Repetitor\          # Spring Boot backend
│   ├── src\main\java\...
│   │   ├── config\             # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller\         # REST контроллеры
│   │   ├── dto\                # Request/Response DTO
│   │   ├── entity\             # JPA сущности
│   │   ├── enums\              # Role, SlotStatus, BookingStatus
│   │   ├── exception\          # GlobalExceptionHandler
│   │   ├── repository\         # JPA репозитории
│   │   ├── security\           # JWT: JwtService, JwtAuthFilter
│   │   └── service\            # Бизнес-логика
│   └── Dockerfile
├── Els_Lew_Repetitor_Frontend\ # Фронтенд
│   ├── index.html              # Лендинг
│   ├── login.html              # Вход
│   ├── register.html           # Регистрация
│   ├── cities.html             # Выбор города
│   ├── subjects.html           # Предметы по городу
│   ├── tutors.html             # Список репетиторов с фильтрами
│   ├── tutor-profile.html      # Профиль репетитора
│   ├── student-cabinet.html    # Кабинет студента
│   ├── tutor-cabinet.html      # Кабинет репетитора (FullCalendar)
│   ├── css\style.css
│   └── js\api.js
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## Запуск

### Локально (без Docker)

1. **Установите PostgreSQL** и создайте базу данных:
   ```sql
   CREATE DATABASE postgres;
   ```

2. **Настройте** `application.properties` (уже настроен для `localhost:5432`).

3. **Запустите бекенд**:
   ```bash
   cd Els_Lew_Repetitor
   ./mvnw spring-boot:run
   ```

4. **Откройте фронтенд** — просто откройте `Els_Lew_Repetitor_Frontend/index.html` в браузере.

5. **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### Через Docker Compose

```bash
docker-compose up --build
```

| Сервис | URL |
|---|---|
| Фронтенд (Nginx) | http://localhost:3000 |
| Бекенд API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5432 |

---

## API Endpoints

### Аутентификация
| Метод | URL | Описание |
|---|---|---|
| POST | `/api/v1/auth/register` | Регистрация |
| POST | `/api/v1/auth/login` | Вход |

### Публичные
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/cities` | Список городов |
| GET | `/api/v1/subjects` | Все предметы |
| GET | `/api/v1/subjects/by-city/{cityId}` | Предметы по городу |
| GET | `/api/v1/tutors` | Репетиторы (фильтры: cityId, subjectId, minPrice, maxPrice, minRating, maxRating) |
| GET | `/api/v1/tutors/{id}` | Профиль репетитора |
| GET | `/api/v1/tutors/{id}/slots` | Свободные слоты |
| GET | `/api/v1/reviews/tutor/{id}` | Отзывы репетитора |

### Студент (требует JWT)
| Метод | URL | Описание |
|---|---|---|
| POST | `/api/v1/bookings` | Записаться на урок |
| GET | `/api/v1/bookings` | Мои записи |
| PUT | `/api/v1/bookings/{id}/cancel` | Отменить запись |
| GET | `/api/v1/student/progress` | Прогресс |
| PUT | `/api/v1/student/progress/{subjectId}` | Обновить прогресс |
| GET | `/api/v1/materials/my` | Мои материалы |
| POST | `/api/v1/reviews` | Оставить отзыв |

### Репетитор (требует JWT)
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/v1/tutors/me/profile` | Мой профиль |
| PUT | `/api/v1/tutors/me/profile` | Обновить профиль |
| POST | `/api/v1/tutors/me/slots` | Добавить слот |
| DELETE | `/api/v1/tutors/me/slots/{id}` | Удалить слот |
| GET | `/api/v1/tutors/me/bookings` | Записи ко мне |
| PUT | `/api/v1/tutors/me/bookings/{id}/complete` | Завершить урок |
| POST | `/api/v1/materials` | Загрузить материал |

### Сообщения (требует JWT)
| Метод | URL | Описание |
|---|---|---|
| POST | `/api/v1/messages` | Отправить сообщение |
| GET | `/api/v1/messages/conversation/{userId}` | Переписка |
| GET | `/api/v1/messages/unread-count` | Кол-во непрочитанных |

---

## База данных (схема)

```
users          — пользователи (STUDENT / TUTOR)
cities         — города (15 шт., заполняется автоматически)
subjects       — предметы ОГЭ/ЕГЭ (16 шт., заполняется автоматически)
tutor_profiles — профили репетиторов (1:1 с users)
tutor_subjects — связь репетитор ↔ предмет (M:M)
tutor_slots    — доступные слоты репетитора
bookings       — записи студентов на уроки
reviews        — отзывы на репетиторов
materials      — учебные материалы
student_progress — прогресс студента по предметам
messages       — внутренние сообщения
```

---

## Коммуникация репетитор ↔ студент

Реализована встроенная система сообщений:
- Сообщения хранятся в таблице `messages`
- REST API для отправки и получения
- Фронтенд опрашивает API при открытии чата
- Также репетиторы могут указать Telegram, ВКонтакте и телефон в профиле
#   E l s _ L e w  
 