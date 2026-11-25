package com.rgukt.nss.contact;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(
            ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    // Submit a new contact message
    @PostMapping
    public ContactMessage submitMessage(
            @RequestBody ContactMessage contactMessage) {

        return contactMessageService.saveMessage(contactMessage);
    }

    // Get all messages
    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return contactMessageService.getAllMessages();
    }

    // Get message by ID
    @GetMapping("/{id}")
    public ContactMessage getMessageById(@PathVariable Long id) {
        return contactMessageService.getMessageById(id);
    }

    // Update message status
    @PutMapping("/{id}/status")
    public ContactMessage updateStatus(
            @PathVariable Long id,
            @RequestParam ContactMessage.Status status) {

        return contactMessageService.updateStatus(id, status);
    }

    // Delete message
    @DeleteMapping("/{id}")
    public String deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return "Contact message deleted successfully";
    }

    // Get total message count
    @GetMapping("/count")
    public long getMessageCount() {
        return contactMessageService.getMessageCount();
    }
}
