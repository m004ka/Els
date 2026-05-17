<div align="center">

# RepEdu
### Платформа для поиска репетиторов и организации учебного процесса

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)

</div>

---

## О проекте

**RepEdu** — веб-платформа для поиска репетиторов по городу и предмету, записи на уроки и организации учебного процесса. Студенты находят подходящего репетитора, отслеживают прогресс и общаются напрямую. Репетиторы управляют расписанием, материалами и получают аналитику.

---

## Стек технологий

| Слой | Технологии |
|:---|:---|
| **Backend** | Java 21, Spring Boot 4.0.6, Spring Security + JWT, Spring Data JPA, Hibernate, Lombok, MapStruct |
| **База данных** | PostgreSQL 16 |
| **Frontend** | HTML5, Tailwind CSS, Vanilla JS, FullCalendar 6 |
| **API Docs** | Springdoc OpenAPI (Swagger UI) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## Функциональность

<details>
<summary><b>Для студентов</b></summary>

- Регистрация и авторизация (JWT)
- Поиск репетиторов по городу и предмету
- Фильтрация по цене и рейтингу (слайдер 1.0–5.0)
- Просмотр профиля: фото, биография, предметы, отзывы
- Запись на урок через интерактивное расписание
- Личный кабинет: записи, прогресс, учебные материалы, переписка

</details>

<details>
<summary><b>Для репетиторов</b></summary>

- Управление профилем: биография, фото, цена, предметы, контакты
- Расписание с FullCalendar: добавление и удаление слотов
- Управление записями: подтверждение, завершение уроков
- Загрузка учебных материалов для студентов
- Статистика: уроков проведено, средний рейтинг, распределение оценок
- Внутренняя переписка со студентами

</details>

<details>
<summary><b>Общее</b></summary>

- 15 крупных городов России
- 16 предметов ОГЭ/ЕГЭ (Математика, Физика, Химия, Английский и др.)
- Система отзывов с рейтингом 1–5, автопересчёт среднего
- Внутренняя система сообщений (REST, хранение в БД)

</details>

---

## Структура проекта

```
Els_Lew/
├── Els_Lew_Repetitor/              # Spring Boot backend
│   └── src/main/java/.../
│       ├── config/                 # SecurityConfig, CorsConfig, DataInitializer
│       ├── controller/             # REST контроллеры
│       ├── dto/                    # Request / Response DTO
│       ├── entity/                 # JPA сущности
│       ├── enums/                  # Role, SlotStatus, BookingStatus
│       ├── exception/              # GlobalExceptionHandler
│       ├── repository/             # JPA репозитории
│       ├── security/               # JwtService, JwtAuthFilter
│       └── service/                # Бизнес-логика
│
├── Els_Lew_Repetitor_Frontend/     # Фронтенд
│   ├── index.html                  # Лендинг
│   ├── login.html / register.html
│   ├── cities.html / subjects.html
│   ├── tutors.html                 # Список с фильтрами
│   ├── tutor-profile.html
│   ├── student-cabinet.html
│   ├── tutor-cabinet.html          # FullCalendar
│   ├── css/style.css
│   └── js/api.js
│
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## Запуск

### Docker Compose (рекомендуется)

```bash
docker-compose up --build
```

| Сервис | URL |
|:---|:---|
| Фронтенд | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5432 |

### Локально

1. Создать БД PostgreSQL:
   ```sql
   CREATE DATABASE postgres;
   ```

2. Запустить бекенд:
   ```bash
   cd Els_Lew_Repetitor
   ./mvnw spring-boot:run
   ```

3. Открыть `Els_Lew_Repetitor_Frontend/index.html` в браузере.

---

## API

<details>
<summary><b>Аутентификация</b></summary>

| Метод | URL | Описание |
|:---|:---|:---|
| `POST` | `/api/v1/auth/register` | Регистрация |
| `POST` | `/api/v1/auth/login` | Вход |

</details>

<details>
<summary><b>Публичные endpoints</b></summary>

| Метод | URL | Описание |
|:---|:---|:---|
| `GET` | `/api/v1/cities` | Список городов |
| `GET` | `/api/v1/subjects` | Все предметы |
| `GET` | `/api/v1/subjects/by-city/{cityId}` | Предметы по городу |
| `GET` | `/api/v1/tutors` | Репетиторы (фильтры: city, subject, price, rating) |
| `GET` | `/api/v1/tutors/{id}` | Профиль репетитора |
| `GET` | `/api/v1/tutors/{id}/slots` | Свободные слоты |
| `GET` | `/api/v1/reviews/tutor/{id}` | Отзывы репетитора |

</details>

<details>
<summary><b>Студент (JWT)</b></summary>

| Метод | URL | Описание |
|:---|:---|:---|
| `POST` | `/api/v1/bookings` | Записаться на урок |
| `GET` | `/api/v1/bookings` | Мои записи |
| `PUT` | `/api/v1/bookings/{id}/cancel` | Отменить запись |
| `GET` | `/api/v1/student/progress` | Прогресс по предметам |
| `GET` | `/api/v1/materials/my` | Мои материалы |
| `POST` | `/api/v1/reviews` | Оставить отзыв |

</details>

<details>
<summary><b>Репетитор (JWT)</b></summary>

| Метод | URL | Описание |
|:---|:---|:---|
| `GET/PUT` | `/api/v1/tutors/me/profile` | Профиль |
| `POST` | `/api/v1/tutors/me/slots` | Добавить слот |
| `DELETE` | `/api/v1/tutors/me/slots/{id}` | Удалить слот |
| `GET` | `/api/v1/tutors/me/bookings` | Записи ко мне |
| `PUT` | `/api/v1/tutors/me/bookings/{id}/complete` | Завершить урок |
| `POST` | `/api/v1/materials` | Загрузить материал |

</details>

<details>
<summary><b>Сообщения (JWT)</b></summary>

| Метод | URL | Описание |
|:---|:---|:---|
| `POST` | `/api/v1/messages` | Отправить сообщение |
| `GET` | `/api/v1/messages/conversation/{userId}` | Переписка |
| `GET` | `/api/v1/messages/unread-count` | Кол-во непрочитанных |

</details>

---

## Схема базы данных

```
users             — пользователи (роль: STUDENT / TUTOR)
cities            — 15 городов (заполняется при старте)
subjects          — 16 предметов ОГЭ/ЕГЭ (заполняется при старте)
tutor_profiles    — профили репетиторов (1:1 с users)
tutor_subjects    — связь репетитор ↔ предмет (M:M)
tutor_slots       — доступные временные слоты
bookings          — записи студентов на уроки
reviews           — отзывы (рейтинг 1–5)
materials         — учебные материалы
student_progress  — прогресс студента по предметам
messages          — внутренняя переписка
```
