package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import springboot.spring.entities.CardMatchScore;

public interface CardMatchScoreRepo extends JpaRepository<CardMatchScore, Long>{
    public CardMatchScore findByUsername(String username);
    List<CardMatchScore> findTop10ByOrderByTimeDesc();
}
