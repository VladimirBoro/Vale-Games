package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import springboot.spring.entities.FroggerScore;

public interface FroggerScoreRepo extends JpaRepository<FroggerScore, Long> {
    public FroggerScore findByUsername(String username);
    public List<FroggerScore> findTop10ByOrderByScoreDesc();
    public List<FroggerScore> findAllByScoreDesc();
}
