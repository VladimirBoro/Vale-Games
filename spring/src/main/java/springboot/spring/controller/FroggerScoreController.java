package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.entities.FroggerScore;
import springboot.spring.entities.SnakeScore;
import springboot.spring.repo.FroggerScoreRepo;
import springboot.spring.util.DateUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping(path = "/frogger")
public class FroggerScoreController {
    private DateUtil date = new DateUtil();

    @Autowired
    private FroggerScoreRepo froggerRepo; 

    @GetMapping("/leaderboard-top10")
    public Iterable<FroggerScore> getLeaderBoardTop10() {
        return froggerRepo.findTop10ByOrderByScoreDesc();
    }

    @GetMapping("/leaderboard")
    public Iterable<FroggerScore> getLeaderBoard() {
        return froggerRepo.findAllByScoreDesc();
    }
    
    @PostMapping("/add")
    public String postAdd(@RequestParam String username, @RequestParam int score) {
       String response = "not signed in";

        FroggerScore oldFroggerScore = froggerRepo.findByUsername(username);
        System.out.println(oldFroggerScore);
        if (oldFroggerScore != null && oldFroggerScore.getScore() < score) {
            System.out.println("Updating score...");
            response = "UPDATED highscore of: " + username;
            oldFroggerScore.setScore(score);
            oldFroggerScore.setDate(date.getDate());
            froggerRepo.save(oldFroggerScore);
        }
        else if (oldFroggerScore == null) {
            System.out.println("Adding new score...");
            response = "ADDED first highscore of: " + username;
            FroggerScore snakeScore = new FroggerScore();
            snakeScore.setUsername(username);
            snakeScore.setScore(score);
            snakeScore.setDate(date.getDate());
            froggerRepo.save(snakeScore);
        }

        return response;
    }
    

}
