package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.MessageRequest;
import org.example.els_lew_repetitor.dto.response.MessageResponse;
import org.example.els_lew_repetitor.service.MessageService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Сообщения")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public MessageResponse sendMessage(@AuthenticationPrincipal UserDetails userDetails,
                                        @Valid @RequestBody MessageRequest request) {
        return messageService.sendMessage(userDetails.getUsername(), request);
    }

    @GetMapping("/conversation/{userId}")
    public List<MessageResponse> getConversation(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long userId) {
        return messageService.getConversation(userDetails.getUsername(), userId);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return Map.of("count", messageService.getUnreadCount(userDetails.getUsername()));
    }

    @GetMapping("/contacts")
    public List<Long> getContacts(@AuthenticationPrincipal UserDetails userDetails) {
        return messageService.getContacts(userDetails.getUsername());
    }
}
