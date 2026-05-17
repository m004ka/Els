package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.AuthRequest;
import org.example.els_lew_repetitor.dto.request.RegisterRequest;
import org.example.els_lew_repetitor.dto.response.AuthResponse;
import org.example.els_lew_repetitor.entity.City;
import org.example.els_lew_repetitor.entity.TutorProfile;
import org.example.els_lew_repetitor.entity.User;
import org.example.els_lew_repetitor.enums.Role;
import org.example.els_lew_repetitor.exception.BadRequestException;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.CityRepository;
import org.example.els_lew_repetitor.repository.TutorProfileRepository;
import org.example.els_lew_repetitor.repository.UserRepository;
import org.example.els_lew_repetitor.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email уже зарегистрирован");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Имя пользователя уже занято");
        }

        City city = null;
        if (request.getCityId() != null) {
            city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new NotFoundException("Город не найден"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .city(city)
                .build();

        userRepository.save(user);

        if (user.getRole() == Role.TUTOR) {
            TutorProfile profile = TutorProfile.builder()
                    .user(user)
                    .city(city)
                    .build();
            tutorProfileRepository.save(profile);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(token, user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
