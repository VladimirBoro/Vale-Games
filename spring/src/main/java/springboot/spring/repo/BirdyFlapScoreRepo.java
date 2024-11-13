package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import springboot.spring.entities.BirdyFlapScore;

public interface BirdyFlapScoreRepo extends JpaRepository<BirdyFlapScore, Long> {
    public BirdyFlapScore findByUsername(String username);
    public List<BirdyFlapScore> findTop10ByOrderByScoreDesc();
    public List<BirdyFlapScore> findAllByOrderByScoreDesc();
}
