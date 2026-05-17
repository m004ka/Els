package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.Material;
import org.example.els_lew_repetitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByStudentOrderByCreatedAtDesc(User student);
    List<Material> findByTutorOrderByCreatedAtDesc(User tutor);
}
