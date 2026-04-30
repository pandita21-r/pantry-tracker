
package com.example.pantrytracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity // Links this class to a database table
@Table(name = "pantry_items") // Sets the table name in the database
public class PantryItem {

    @Id // Marks this as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Automatically counts (1, 2, 3...)
    private Long id;

    @Column(nullable = false) // Ensures the name is never empty
    private String name;

    private Integer quantity;

    private String category;

    private LocalDate expirationDate;

    // --- CONSTRUCTORS ---
    public PantryItem() {}

    public PantryItem(String name, Integer quantity, String category, LocalDate expirationDate) {
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.expirationDate = expirationDate;
    }

    // --- GETTERS AND SETTERS ---
    // (Right-click in VS Code -> Source Action -> Generate Getters and Setters)
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
}

