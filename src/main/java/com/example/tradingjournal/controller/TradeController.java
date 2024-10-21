package com.example.tradingjournal.controller;

import com.example.tradingjournal.model.Trade;
import com.example.tradingjournal.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @GetMapping
    public ResponseEntity<List<Trade>> getAllTrades(Authentication authentication) {
        String userId = authentication.getName();
        List<Trade> trades = tradeService.getAllTradesForUser(userId);
        return ResponseEntity.ok(trades);
    }

    @PostMapping
    public ResponseEntity<Trade> addTrade(@RequestBody Trade trade, Authentication authentication) {
        trade.setUserId(authentication.getName());
        Trade newTrade = tradeService.addTrade(trade);
        return ResponseEntity.ok(newTrade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trade> updateTrade(@PathVariable String id, @RequestBody Trade trade, Authentication authentication) {
        trade.setId(id);
        trade.setUserId(authentication.getName());
        Trade updatedTrade = tradeService.updateTrade(trade);
        return ResponseEntity.ok(updatedTrade);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrade(@PathVariable String id) {
        tradeService.deleteTrade(id);
        return ResponseEntity.ok().build();
    }
}