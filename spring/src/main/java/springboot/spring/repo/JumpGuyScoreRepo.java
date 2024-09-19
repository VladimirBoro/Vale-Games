package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import springboot.spring.entities.JumpGuyScore;

public interface JumpGuyScoreRepo extends JpaRepository<JumpGuyScore, Long> {
    public JumpGuyScore findByUsername(String username);
    public List<JumpGuyScore> findTop10ByOrderByScoreDesc();
}
