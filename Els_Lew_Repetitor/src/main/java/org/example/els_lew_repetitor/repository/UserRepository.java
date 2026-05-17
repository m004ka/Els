package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.example.els_lew_repetitor.enums.Role;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    long countByRole(Role role);
    List<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
