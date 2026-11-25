package com.rgukt.nss.contact;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(
            ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    // Save a new contact message
    public ContactMessage saveMessage(ContactMessage contactMessage) {
        return contactMessageRepository.save(contactMessage);
    }

    // Get all contact messages
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    // Get a message by ID
    public ContactMessage getMessageById(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Contact message not found with ID: " + id));
    }

    // Update message status
    public ContactMessage updateStatus(
            Long id, ContactMessage.Status status) {

        ContactMessage contactMessage = getMessageById(id);
        contactMessage.setStatus(status);

        return contactMessageRepository.save(contactMessage);
    }

    // Delete a message
    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }

    // Count total messages
    public long getMessageCount() {
        return contactMessageRepository.count();
    }
}
