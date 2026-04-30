package com.teamBangan.pantrytracker.repository;

import com.teamBangan.pantrytracker.model.PantryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // This tells Spring to manage this as a bean
public interface PantryRepository extends JpaRepository<PantryItem, Long> {
    // You don't need to write any methods here yet!
    // JpaRepository already has save(), delete(), findAll(), etc.
}
