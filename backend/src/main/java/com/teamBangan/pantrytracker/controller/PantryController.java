package com.example.pantrytracker.controller;

import com.example.pantrytracker.model.PantryItem;
import com.example.pantrytracker.repository.PantryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Tells Spring this class handles API requests
@RequestMapping("/api/pantry") // The base URL for all endpoints in this file
@CrossOrigin(origins = "http://localhost:3000") // Allows your Frontend to talk to this Backend
public class PantryController {

    @Autowired
    private PantryRepository pantryRepository; // Connects the Repository magic here

    // 1. GET all items (Read)
    @GetMapping
    public List<PantryItem> getAllItems() {
        return pantryRepository.findAll();
    }

    // 2. POST a new item (Create)
    @PostMapping
    public PantryItem createItem(@RequestBody PantryItem item) {
        return pantryRepository.save(item);
    }

    // 3. DELETE an item by ID (Delete)
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        pantryRepository.deleteById(id);
    }
}