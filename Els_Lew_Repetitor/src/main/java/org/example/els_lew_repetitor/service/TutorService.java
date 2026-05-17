package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.SlotRequest;
import org.example.els_lew_repetitor.dto.request.TutorProfileRequest;
import org.example.els_lew_repetitor.dto.response.SlotResponse;
import org.example.els_lew_repetitor.dto.response.TutorResponse;
import org.example.els_lew_repetitor.entity.*;
import org.example.els_lew_repetitor.enums.SlotStatus;
import org.example.els_lew_repetitor.exception.BadRequestException;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TutorService {

    private final TutorProfileRepository tutorProfileRepository;
    private final TutorSlotRepository tutorSlotRepository;
    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final SubjectRepository subjectRepository;

    public List<TutorResponse> getTutors(Long cityId, Long subjectId,
                                          BigDecimal minPrice, BigDecimal maxPrice,
                                          Double minRating, Double maxRating) {
        return tutorProfileRepository.findAll().stream()
                .filter(tp -> cityId == null || (tp.getCity() != null && tp.getCity().getId().equals(cityId)))
                .filter(tp -> subjectId == null || tp.getSubjects().stream().anyMatch(s -> s.getId().equals(subjectId)))
                .filter(tp -> minPrice == null || (tp.getPricePerHour() != null && tp.getPricePerHour().compareTo(minPrice) >= 0))
                .filter(tp -> maxPrice == null || (tp.getPricePerHour() != null && tp.getPricePerHour().compareTo(maxPrice) <= 0))
                .filter(tp -> minRating == null || tp.getRating() >= minRating)
                .filter(tp -> maxRating == null || tp.getRating() <= maxRating)
                .map(this::toResponse)
                .toList();
    }

    public TutorResponse getTutorById(Long id) {
        return toResponse(tutorProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден")));
    }

    @Transactional
    public TutorResponse updateProfile(String email, TutorProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        TutorProfile profile = tutorProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Профиль репетитора не найден"));

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getPhotoUrl() != null) profile.setPhotoUrl(request.getPhotoUrl());
        if (request.getPricePerHour() != null) profile.setPricePerHour(request.getPricePerHour());
        if (request.getTelegramContact() != null) profile.setTelegramContact(request.getTelegramContact());
        if (request.getVkContact() != null) profile.setVkContact(request.getVkContact());
        if (request.getPhoneContact() != null) profile.setPhoneContact(request.getPhoneContact());

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new NotFoundException("Город не найден"));
            profile.setCity(city);
        }

        if (request.getSubjectIds() != null) {
            Set<Subject> subjects = request.getSubjectIds().stream()
                    .map(id -> subjectRepository.findById(id)
                            .orElseThrow(() -> new NotFoundException("Предмет не найден: " + id)))
                    .collect(Collectors.toSet());
            profile.setSubjects(subjects);
        }

        return toResponse(tutorProfileRepository.save(profile));
    }

    @Transactional
    public SlotResponse addSlot(String email, SlotRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        TutorProfile profile = tutorProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Профиль репетитора не найден"));

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new BadRequestException("Время начала должно быть раньше времени окончания");
        }
        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Нельзя создавать слоты в прошлом");
        }

        BigDecimal price = request.getPrice() != null ? request.getPrice() : profile.getPricePerHour();

        TutorSlot slot = TutorSlot.builder()
                .tutorProfile(profile)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .price(price)
                .status(SlotStatus.FREE)
                .build();

        return toSlotResponse(tutorSlotRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(String email, Long slotId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        TutorSlot slot = tutorSlotRepository.findById(slotId)
                .orElseThrow(() -> new NotFoundException("Слот не найден"));

        if (!slot.getTutorProfile().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Нет прав на удаление этого слота");
        }
        if (slot.getStatus() == SlotStatus.BOOKED) {
            throw new BadRequestException("Нельзя удалить забронированный слот");
        }

        tutorSlotRepository.delete(slot);
    }

    public List<SlotResponse> getTutorSlots(Long tutorProfileId) {
        TutorProfile profile = tutorProfileRepository.findById(tutorProfileId)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));
        return tutorSlotRepository
                .findByTutorProfileAndStartTimeAfterOrderByStartTimeAsc(profile, LocalDateTime.now())
                .stream().map(this::toSlotResponse).toList();
    }

    public List<SlotResponse> getMySlots(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        TutorProfile profile = tutorProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Профиль репетитора не найден"));
        return tutorSlotRepository.findByTutorProfileOrderByStartTimeAsc(profile)
                .stream().map(this::toSlotResponse).toList();
    }

    public TutorResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        TutorProfile profile = tutorProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Профиль репетитора не найден"));
        return toResponse(profile);
    }

    private TutorResponse toResponse(TutorProfile tp) {
        return TutorResponse.builder()
                .id(tp.getId())
                .userId(tp.getUser().getId())
                .firstName(tp.getUser().getFirstName())
                .lastName(tp.getUser().getLastName())
                .username(tp.getUser().getUsername())
                .photoUrl(tp.getPhotoUrl())
                .bio(tp.getBio())
                .pricePerHour(tp.getPricePerHour())
                .rating(tp.getRating())
                .totalLessons(tp.getTotalLessons())
                .totalReviews(tp.getTotalReviews())
                .telegramContact(tp.getTelegramContact())
                .vkContact(tp.getVkContact())
                .phoneContact(tp.getPhoneContact())
                .cityName(tp.getCity() != null ? tp.getCity().getName() : null)
                .subjects(tp.getSubjects().stream().map(Subject::getName).toList())
                .build();
    }

    private SlotResponse toSlotResponse(TutorSlot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .status(slot.getStatus())
                .price(slot.getPrice())
                .tutorProfileId(slot.getTutorProfile().getId())
                .build();
    }
}
