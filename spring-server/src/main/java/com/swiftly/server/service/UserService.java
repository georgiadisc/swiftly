package com.swiftly.server.service;

import com.swiftly.server.dto.UserDTO;
import com.swiftly.server.entity.User;
import com.swiftly.server.exception.ResourceNotFoundException;
import com.swiftly.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    public UserDTO getUserById(Integer userId) {
        log.info("Fetching user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        UserDTO userDTO = mapUserToDTO(user);
        log.info("Successfully fetched user: {}", user.getTag());
        return userDTO;
    }

    private UserDTO mapUserToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getTag(),
                user.getAddress(),
                user.getEmail(),
                user.getPhone());
    }
}