package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.entities.SnakeScore;
import springboot.spring.repo.SnakeScoreRepo;
import springboot.spring.util.DateUtil;

@RestController
@RequestMapping(path = "/snake")
public class SnakeScoreController {
    private DateUtil dateUtil = new DateUtil();

    @Autowired
    private final SnakeScoreRepo snakeScoreRepo;

    public SnakeScoreController(SnakeScoreRepo snakeScoreRepo) {
        this.snakeScoreRepo = snakeScoreRepo;
    }

    @GetMapping(path = "/leaderboard")
    public @ResponseBody Iterable<SnakeScore> getSnakeScores() {
        return snakeScoreRepo.findTop10ByOrderByScoreDesc();
    }

    @GetMapping(path = "/leaderboard-top10")
    public @ResponseBody Iterable<SnakeScore> getSnakeScoresTop10() {
        return snakeScoreRepo.findAllByOrderByScoreDesc();
    }

    @PostMapping(path = "/add") 
    public @ResponseBody String addNewSnakeScore(@RequestParam String username
        , @RequestParam int score) {

        String response = "not signed in";

        SnakeScore oldSnakeScore = snakeScoreRepo.findByUsername(username);
        System.out.println(oldSnakeScore);
        if (oldSnakeScore != null && oldSnakeScore.getScore() < score) {
            System.out.println("Updating score...");
            response = "UPDATED highscore of: " + username;
            oldSnakeScore.setScore(score);
            oldSnakeScore.setDate(dateUtil.getDate());
            snakeScoreRepo.save(oldSnakeScore);
        }
        else if (oldSnakeScore == null) {
            System.out.println("Adding new score...");
            response = "ADDED first highscore of: " + username;
            SnakeScore snakeScore = new SnakeScore();
            snakeScore.setUsername(username);
            snakeScore.setScore(score);
            snakeScore.setDate(dateUtil.getDate());
            snakeScoreRepo.save(snakeScore);
        }

        return response;
    }

}
