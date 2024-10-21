package com.example.tradingjournal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Document(collection = "trades")
public class Trade {
    @Id
    private String id;
    private String userId;
    private String symbol;
    private double entryPrice;
    private double exitPrice;
    private int quantity;
    private LocalDate date;
    private String type;
    private String notes;
}