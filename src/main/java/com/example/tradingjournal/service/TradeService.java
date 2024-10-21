package com.example.tradingjournal.service;

import com.example.tradingjournal.model.Trade;
import com.example.tradingjournal.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;

    public List<Trade> getAllTradesForUser(String userId) {
        return tradeRepository.findByUserId(userId);
    }

    public Trade addTrade(Trade trade) {
        return tradeRepository.save(trade);
    }

    public Trade updateTrade(Trade trade) {
        return tradeRepository.save(trade);
    }

    public void deleteTrade(String id) {
        tradeRepository.deleteById(id);
    }
}