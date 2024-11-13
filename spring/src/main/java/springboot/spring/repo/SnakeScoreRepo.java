package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import springboot.spring.entities.SnakeScore;

@RepositoryRestResource
public interface SnakeScoreRepo extends JpaRepository<SnakeScore, Long> {
    public SnakeScore findByUsername(String username);
    public List<SnakeScore> findTop10ByOrderByScoreDesc();
    public List<SnakeScore> findAllByOrderByScoreDesc();
}
