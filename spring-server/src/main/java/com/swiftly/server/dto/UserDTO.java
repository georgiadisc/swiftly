package com.swiftly.server.dto;

public record UserDTO(
        Integer id,
        String name,
        String tag,
        String address,
        String email,
        String phone) {
}