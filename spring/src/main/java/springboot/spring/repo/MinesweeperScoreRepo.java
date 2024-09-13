package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import springboot.spring.entities.MinesweeperScore;

public interface MinesweeperScoreRepo extends JpaRepository<MinesweeperScore, Long> {
    public MinesweeperScore findByUsername(String username);
    List<MinesweeperScore> findTop10ByOrderByTime();
}
