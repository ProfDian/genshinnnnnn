package com.genshinimpact.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.dto.UserResponse;
import com.genshinimpact.model.User;
import com.genshinimpact.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public UserResponse getUserById(Integer id) {
        return userRepository.findById(id)
                .map(UserResponse::fromUser)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public UserResponse getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserResponse::fromUser)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
    
    @Transactional
    public UserResponse createUser(User user) {
        // Check if username exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
    
    @Transactional
    public UserResponse updateUser(Integer id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Update fields if provided
        if (userDetails.getUsername() != null && !userDetails.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDetails.getUsername())) {
                throw new RuntimeException("Username is already taken!");
            }
            user.setUsername(userDetails.getUsername());
        }
        
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(userDetails.getEmail());
        }
        
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        
        if (userDetails.getBio() != null) {
            user.setBio(userDetails.getBio());
        }
        
        if (userDetails.getProfileImage() != null) {
            user.setProfileImage(userDetails.getProfileImage());
        }
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }
    
    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        userRepository.delete(user);
    }
}