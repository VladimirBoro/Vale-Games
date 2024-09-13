package springboot.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import springboot.spring.entities.BirdyFlapScore;
import springboot.spring.entities.CardMatchScore;
import springboot.spring.entities.FroggerScore;
import springboot.spring.entities.MinesweeperScore;
import springboot.spring.entities.SnakeScore;
import springboot.spring.repo.BirdyFlapScoreRepo;
import springboot.spring.repo.CardMatchScoreRepo;
import springboot.spring.repo.FroggerScoreRepo;
import springboot.spring.repo.MinesweeperScoreRepo;
import springboot.spring.repo.SnakeScoreRepo;

@Service
public class ScoreService {
    @Autowired
    BirdyFlapScoreRepo birdyFlapScoreRepo;

    @Autowired
    CardMatchScoreRepo cardMatchScoreRepo;

    @Autowired
    FroggerScoreRepo froggerScoreRepo;

    @Autowired
    MinesweeperScoreRepo minesweeperScoreRepo;

    @Autowired
    SnakeScoreRepo snakeScoreRepo;

    public void updateUsername(String oldUsername, String newUsername) {
        BirdyFlapScore birdyFlapScore = birdyFlapScoreRepo.findByUsername(oldUsername);
        CardMatchScore cardMatchScore = cardMatchScoreRepo.findByUsername(oldUsername);
        FroggerScore froggerScore = froggerScoreRepo.findByUsername(oldUsername);
        MinesweeperScore minesweeperScore = minesweeperScoreRepo.findByUsername(oldUsername);
        SnakeScore snakeScore = snakeScoreRepo.findByUsername(oldUsername);

        if (birdyFlapScore != null) {
            birdyFlapScore.setUsername(newUsername);
            birdyFlapScoreRepo.save(birdyFlapScore);
        }
        
        if (cardMatchScore != null) {
            cardMatchScore.setUsername(newUsername);
            cardMatchScoreRepo.save(cardMatchScore);
        }
        
        if (froggerScore != null) {
            froggerScore.setUsername(newUsername);
            froggerScoreRepo.save(froggerScore);
        }
        
        if (minesweeperScore != null) {
            minesweeperScore.setUsername(newUsername);
            minesweeperScoreRepo.save(minesweeperScore);
        }
        
        if (snakeScore != null) {
            snakeScore.setUsername(newUsername);
            snakeScoreRepo.save(snakeScore);
        }

    }
}
