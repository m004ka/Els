package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.CityResponse;
import org.example.els_lew_repetitor.repository.CityRepository;
import org.example.els_lew_repetitor.repository.TutorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityService {

    private final CityRepository cityRepository;
    private final TutorProfileRepository tutorProfileRepository;

    public List<CityResponse> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> {
                    long count = tutorProfileRepository.findAll().stream()
                            .filter(tp -> tp.getCity() != null && tp.getCity().getId().equals(city.getId()))
                            .count();
                    return CityResponse.builder()
                            .id(city.getId())
                            .name(city.getName())
                            .tutorCount(count)
                            .build();
                })
                .toList();
    }
}
