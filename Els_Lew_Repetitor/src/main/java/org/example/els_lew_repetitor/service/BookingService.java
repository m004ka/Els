package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.BookingRequest;
import org.example.els_lew_repetitor.dto.response.BookingResponse;
import org.example.els_lew_repetitor.entity.*;
import org.example.els_lew_repetitor.enums.BookingStatus;
import org.example.els_lew_repetitor.enums.SlotStatus;
import org.example.els_lew_repetitor.exception.BadRequestException;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TutorSlotRepository tutorSlotRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Transactional
    public BookingResponse createBooking(String studentEmail, BookingRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));

        TutorSlot slot = tutorSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new NotFoundException("Слот не найден"));

        if (slot.getStatus() != SlotStatus.FREE) {
            throw new BadRequestException("Слот уже занят");
        }

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new NotFoundException("Предмет не найден"));
        }

        slot.setStatus(SlotStatus.BOOKED);
        tutorSlotRepository.save(slot);

        Booking booking = Booking.builder()
                .student(student)
                .slot(slot)
                .subject(subject)
                .status(BookingStatus.CONFIRMED)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getStudentBookings(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));
        return bookingRepository.findByStudentOrderByCreatedAtDesc(student)
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getTutorBookings(String email) {
        User tutor = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));
        return bookingRepository.findByTutor(tutor)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public BookingResponse cancelBooking(String email, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Запись не найдена"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        boolean isStudent = booking.getStudent().getId().equals(user.getId());
        boolean isTutor = booking.getSlot().getTutorProfile().getUser().getId().equals(user.getId());

        if (!isStudent && !isTutor) {
            throw new BadRequestException("Нет прав на отмену этой записи");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getSlot().setStatus(SlotStatus.FREE);
        tutorSlotRepository.save(booking.getSlot());

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse completeBooking(String tutorEmail, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Запись не найдена"));

        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));

        if (!booking.getSlot().getTutorProfile().getUser().getId().equals(tutor.getId())) {
            throw new BadRequestException("Нет прав");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        TutorProfile profile = booking.getSlot().getTutorProfile();
        profile.setTotalLessons(profile.getTotalLessons() + 1);
        tutorProfileRepository.save(profile);

        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking b) {
        TutorProfile tp = b.getSlot().getTutorProfile();
        return BookingResponse.builder()
                .id(b.getId())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .slotStart(b.getSlot().getStartTime())
                .slotEnd(b.getSlot().getEndTime())
                .subjectName(b.getSubject() != null ? b.getSubject().getName() : null)
                .tutorId(tp.getUser().getId())
                .tutorFirstName(tp.getUser().getFirstName())
                .tutorLastName(tp.getUser().getLastName())
                .studentFirstName(b.getStudent().getFirstName())
                .studentLastName(b.getStudent().getLastName())
                .tutorProfileId(tp.getId())
                .studentId(b.getStudent().getId())
                .build();
    }
}
