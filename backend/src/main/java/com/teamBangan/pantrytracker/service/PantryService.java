package com.teamBangan.pantrytracker.service;

import com.teamBangan.pantrytracker.model.PantryItem;
import com.teamBangan.pantrytracker.repository.PantryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Tells Spring this is a Service bean
public class PantryService {

    @Autowired
    private PantryRepository pantryRepository;

    // Get all items
    public List<PantryItem> getAllItems() {
        return pantryRepository.findAll();
    }

    // Save a new item (Logic: You could add a check here to see if the item exists)
    public PantryItem saveItem(PantryItem item) {
        return pantryRepository.save(item);
    }

    // Delete an item
    public void deleteItem(Long id) {
        pantryRepository.deleteById(id);
    }

    // Get a single item by ID
    public Optional<PantryItem> getItemById(Long id) {
        return pantryRepository.findById(id);
    }
}