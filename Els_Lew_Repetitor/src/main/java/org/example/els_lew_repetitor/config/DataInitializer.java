package org.example.els_lew_repetitor.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.els_lew_repetitor.entity.*;
import org.example.els_lew_repetitor.enums.Role;
import org.example.els_lew_repetitor.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final CityRepository cityRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedCities();
        seedSubjects();
        seedAdmin();
        seedTutors();
    }

    private void seedCities() {
        List<String> cities = List.of(
                "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург",
                "Казань", "Нижний Новгород", "Челябинск", "Самара",
                "Уфа", "Ростов-на-Дону", "Краснодар", "Омск",
                "Воронеж", "Пермь", "Волгоград"
        );
        cities.forEach(name -> {
            if (!cityRepository.existsByName(name))
                cityRepository.save(City.builder().name(name).build());
        });
        log.info("Cities initialized");
    }

    private void seedSubjects() {
        List<String[]> subjects = List.of(
                new String[]{"Математика", "ОГЭ/ЕГЭ"},
                new String[]{"Русский язык", "ОГЭ/ЕГЭ"},
                new String[]{"Физика", "ОГЭ/ЕГЭ"},
                new String[]{"Химия", "ОГЭ/ЕГЭ"},
                new String[]{"Биология", "ОГЭ/ЕГЭ"},
                new String[]{"История", "ОГЭ/ЕГЭ"},
                new String[]{"Обществознание", "ОГЭ/ЕГЭ"},
                new String[]{"География", "ОГЭ/ЕГЭ"},
                new String[]{"Информатика и ИКТ", "ОГЭ/ЕГЭ"},
                new String[]{"Английский язык", "ОГЭ/ЕГЭ"},
                new String[]{"Немецкий язык", "ОГЭ/ЕГЭ"},
                new String[]{"Французский язык", "ОГЭ/ЕГЭ"},
                new String[]{"Испанский язык", "ЕГЭ"},
                new String[]{"Китайский язык", "ЕГЭ"},
                new String[]{"Литература", "ОГЭ/ЕГЭ"},
                new String[]{"Астрономия", "ЕГЭ"}
        );
        subjects.forEach(s -> {
            if (!subjectRepository.existsByName(s[0]))
                subjectRepository.save(Subject.builder().name(s[0]).category(s[1]).build());
        });
        log.info("Subjects initialized");
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@repedu.ru")) {
            userRepository.save(User.builder()
                    .username("repedu_admin")
                    .firstName("Admin")
                    .lastName("RepEdu")
                    .email("admin@repedu.ru")
                    .password(passwordEncoder.encode("Admin@2026"))
                    .role(Role.ADMIN)
                    .build());
            log.info("Admin user created: admin@repedu.ru / Admin@2026");
        }
    }

    @Transactional
    public void seedTutors() {
        if (tutorProfileRepository.count() > 0) return;

        City ufa = cityRepository.findByName("Уфа").orElse(null);
        if (ufa == null) { log.warn("City Уфа not found, skipping tutor seed"); return; }

        // {subject, firstName, lastName, username, email, price, rating, lessons, reviews, bio, telegram}
        List<Object[]> data = List.of(
            // Математика
            row("Математика","Алексей","Петров","alex_petrov","alex.petrov@repedu.ru",1500,4.8,87,23,"Преподаю математику 10 лет. ЕГЭ/ОГЭ под ключ, разбираем каждую тему до полного понимания.","@alex_petrov_math"),
            row("Математика","Наталья","Кузьмина","nat_kuzmin","nat.kuzmin@repedu.ru",1200,4.5,54,15,"Помогаю подтянуть базу и решать сложные задачи. Гарантирую результат от 70 баллов.","@nat_math_ufa"),
            // Русский язык
            row("Русский язык","Светлана","Морозова","svetlana_rus","svetlana.morozova@repedu.ru",1300,4.9,112,31,"Лингвист с 15-летним стажем. Сочинения, грамматика, подготовка к итоговому.","@svetlana_rus"),
            row("Русский язык","Андрей","Волков","andrey_rus","andrey.volkov@repedu.ru",1000,4.3,41,12,"Доступно объясняю сложные правила. Работаю со школьниками 8–11 классов.","@andrey_rus_ufa"),
            // Физика
            row("Физика","Дмитрий","Соколов","dmitry_phys","dmitry.sokolov@repedu.ru",1600,4.7,76,20,"Физтех, 8 лет преподавания. Механика, электродинамика, оптика — от нуля до 90+ баллов.","@dmitry_physics"),
            row("Физика","Елена","Попова","elena_phys","elena.popova@repedu.ru",1400,4.4,38,10,"Работаю с разными уровнями подготовки. Особый акцент на задачи ЕГЭ части C.","@elena_phys"),
            // Химия
            row("Химия","Игорь","Лебедев","igor_chem","igor.lebedev@repedu.ru",1500,4.6,65,18,"Кандидат химических наук. Органика, неорганика, расчётные задачи.","@igor_chem_ufa"),
            row("Химия","Анастасия","Козлова","anastasia_chem","anastasia.kozlova@repedu.ru",1300,4.5,49,14,"Системный подход к химии. Помогаю понять, а не зазубрить.","@nastya_chem"),
            // Биология
            row("Биология","Виктор","Новиков","viktor_bio","viktor.novikov@repedu.ru",1200,4.4,33,9,"Преподаватель вуза. Генетика, эволюция, экология — готовлю к ЕГЭ и олимпиадам.","@viktor_bio"),
            row("Биология","Ольга","Фёдорова","olga_bio","olga.fedorova@repedu.ru",1100,4.2,27,8,"Доступно объясняю анатомию и физиологию. Разбираем тесты ОГЭ по блокам.","@olga_bio_ufa"),
            // История
            row("История","Сергей","Михайлов","sergey_hist","sergey.mikhailov@repedu.ru",1300,4.7,91,25,"Историк, автор курса по подготовке к ЕГЭ. Хронология, причинно-следственные связи, эссе.","@sergey_history"),
            row("История","Татьяна","Андреева","tatiana_hist","tatiana.andreeva@repedu.ru",1200,4.5,62,17,"Разбираем все периоды истории России и мира. Работа с документами и картами.","@tatiana_hist"),
            // Обществознание
            row("Обществознание","Павел","Алексеев","pavel_soc","pavel.alekseev@repedu.ru",1100,4.3,44,13,"Помогаю разобраться в праве, экономике и политике. ЕГЭ — от 75 баллов.","@pavel_soc"),
            row("Обществознание","Юлия","Тимофеева","yulia_soc","yulia.timofeeva@repedu.ru",1000,4.1,29,8,"Работаю с планами, эссе и задачами по праву. Индивидуальная программа.","@yulia_soc"),
            // География
            row("География","Николай","Степанов","nikolay_geo","nikolay.stepanov@repedu.ru",1200,4.5,55,16,"Учитель географии высшей категории. Карты, климат, экономическая география.","@nikolay_geo"),
            row("География","Ирина","Яковлева","irina_geo","irina.yakovleva@repedu.ru",1100,4.3,37,11,"Готовлю к ОГЭ и ЕГЭ. Делаю географию понятной и интересной.","@irina_geo_ufa"),
            // Информатика
            row("Информатика и ИКТ","Максим","Захаров","maxim_it","maxim.zakharov@repedu.ru",1800,4.9,98,27,"Разработчик и преподаватель. Python, алгоритмы, задачи ЕГЭ по информатике.","@maxim_it_ufa"),
            row("Информатика и ИКТ","Артём","Белов","artem_it","artem.belov@repedu.ru",1600,4.7,73,20,"Программирование с нуля, подготовка к ЕГЭ. Работаю на Python и Pascal.","@artem_it"),
            // Английский
            row("Английский язык","Анна","Зайцева","anna_eng","anna.zaitseva@repedu.ru",1500,4.8,104,29,"IELTS 8.0, преподаю английский 12 лет. Speaking, writing, grammar — полный курс.","@anna_eng_ufa"),
            row("Английский язык","Константин","Соловьёв","konst_eng","konst.solovyev@repedu.ru",1400,4.6,68,19,"Подготовка к ЕГЭ и международным экзаменам. Conversational English.","@konst_english"),
            // Немецкий
            row("Немецкий язык","Валерия","Громова","valeria_ger","valeria.gromova@repedu.ru",1300,4.5,42,12,"Жила в Германии 3 года. Грамматика, лексика, разговорный немецкий.","@valeria_deutsch"),
            row("Немецкий язык","Евгений","Крылов","evgeny_ger","evgeny.krylov@repedu.ru",1200,4.3,31,9,"Немецкий для ЕГЭ и путешествий. Понятные объяснения, много практики.","@evgeny_ger"),
            // Французский
            row("Французский язык","Екатерина","Орлова","kate_fra","kate.orlova@repedu.ru",1400,4.7,57,16,"DALF C1. Преподаю французский с 2015 года. Подготовка к ЕГЭ и DELF.","@kate_francais"),
            row("Французский язык","Алина","Воробьёва","alina_fra","alina.vorobyeva@repedu.ru",1200,4.4,35,10,"Работаю с начинающими и продвинутыми. Акцент на разговорную речь.","@alina_fra"),
            // Испанский
            row("Испанский язык","Марина","Сергеева","marina_spa","marina.sergeeva@repedu.ru",1300,4.6,48,14,"Жила в Испании и Мексике. Испанский для ЕГЭ и реального общения.","@marina_espanol"),
            row("Испанский язык","Роман","Кузнецов","roman_spa","roman.kuznetsov@repedu.ru",1100,4.2,26,7,"Испанский с нуля. Грамматика, лексика, аудирование.","@roman_espanol"),
            // Китайский
            row("Китайский язык","Александра","Попова","alex_chi","alex.chi.popova@repedu.ru",1600,4.8,61,17,"Стажировалась в Пекине. HSK 5. Иероглифы, тоны, грамматика.","@alex_chinese"),
            row("Китайский язык","Тимур","Нуриев","timur_chi","timur.nuriev@repedu.ru",1500,4.7,53,15,"Преподаватель китайского языка. Подготовка к ЕГЭ и HSK.","@timur_chinese"),
            // Литература
            row("Литература","Вероника","Смирнова","vero_lit","vero.smirnova@repedu.ru",1200,4.6,77,21,"Филолог. Разбираем произведения, пишем сочинения. ЕГЭ — от 80 баллов.","@vero_literatura"),
            row("Литература","Людмила","Борисова","lyudmila_lit","lyudmila.borisova@repedu.ru",1100,4.4,58,16,"Помогаю понять и полюбить литературу. Работа с текстом, интерпретация.","@lyudmila_lit"),
            // Астрономия
            row("Астрономия","Антон","Голубев","anton_astr","anton.golubev@repedu.ru",1400,4.7,39,11,"Астрофизик, сотрудник обсерватории. Подготовка к ЕГЭ и олимпиадам.","@anton_astro"),
            row("Астрономия","Кристина","Мельникова","krist_astr","krist.melnikova@repedu.ru",1300,4.5,28,8,"Астрономия простым языком. Солнечная система, звёзды, Вселенная.","@krist_astro")
        );

        String encodedPassword = passwordEncoder.encode("Tutor@2026");

        for (Object[] d : data) {
            String email = (String) d[4];
            if (userRepository.existsByEmail(email)) continue;

            Subject subject = subjectRepository.findByName((String) d[0]).orElse(null);
            if (subject == null) continue;

            User user = User.builder()
                    .username((String) d[3])
                    .firstName((String) d[1])
                    .lastName((String) d[2])
                    .email(email)
                    .password(encodedPassword)
                    .role(Role.TUTOR)
                    .city(ufa)
                    .build();
            userRepository.save(user);

            TutorProfile profile = TutorProfile.builder()
                    .user(user)
                    .city(ufa)
                    .pricePerHour(BigDecimal.valueOf((int) d[5]))
                    .rating((double) d[6])
                    .totalLessons((int) d[7])
                    .totalReviews((int) d[8])
                    .bio((String) d[9])
                    .telegramContact((String) d[10])
                    .subjects(new java.util.HashSet<>(Set.of(subject)))
                    .build();
            tutorProfileRepository.save(profile);
        }
        log.info("Tutors seeded: {} profiles", data.size());
    }

    private Object[] row(Object... values) { return values; }
}
