package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.MessageRequest;
import org.example.els_lew_repetitor.dto.response.MessageResponse;
import org.example.els_lew_repetitor.entity.Message;
import org.example.els_lew_repetitor.entity.User;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.MessageRepository;
import org.example.els_lew_repetitor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse sendMessage(String senderEmail, MessageRequest request) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new NotFoundException("Отправитель не найден"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new NotFoundException("Получатель не найден"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .isRead(false)
                .build();

        return toResponse(messageRepository.save(message));
    }

    @Transactional
    public List<MessageResponse> getConversation(String userEmail, Long otherId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        User other = userRepository.findById(otherId)
                .orElseThrow(() -> new NotFoundException("Собеседник не найден"));

        List<Message> messages = messageRepository.findConversation(user, other);
        messages.stream()
                .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.getIsRead())
                .forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(messages);

        return messages.stream().map(this::toResponse).toList();
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        return messageRepository.countByReceiverAndIsReadFalse(user);
    }

    public List<Long> getContacts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        return messageRepository.findBySenderOrReceiver(user, user).stream()
                .map(m -> m.getSender().getId().equals(user.getId()) ? m.getReceiver().getId() : m.getSender().getId())
                .distinct()
                .toList();
    }

    private MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFirstName() + " " + m.getSender().getLastName())
                .receiverId(m.getReceiver().getId())
                .content(m.getContent())
                .isRead(m.getIsRead())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
