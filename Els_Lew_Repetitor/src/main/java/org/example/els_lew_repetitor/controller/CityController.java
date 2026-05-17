package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.CityResponse;
import org.example.els_lew_repetitor.service.CityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@RequiredArgsConstructor
@Tag(name = "Города")
public class CityController {

    private final CityService cityService;

    @GetMapping
    public List<CityResponse> getAllCities() {
        return cityService.getAllCities();
    }
}
