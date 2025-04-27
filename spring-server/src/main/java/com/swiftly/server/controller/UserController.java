package com.swiftly.server.controller;

import com.swiftly.server.dto.UserDTO;
import com.swiftly.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDTO> getUser(@RequestParam Integer userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}