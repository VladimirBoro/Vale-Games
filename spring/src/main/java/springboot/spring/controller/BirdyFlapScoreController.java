package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.entities.BirdyFlapScore;
import springboot.spring.repo.BirdyFlapScoreRepo;
import springboot.spring.util.DateUtil;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping(path = "/birdyflap")
public class BirdyFlapScoreController {
    private DateUtil date = new DateUtil();

    @Autowired
    BirdyFlapScoreRepo repo;

    @GetMapping("/leaderboard-top10")
    public Iterable<BirdyFlapScore> getLeaderboardTop10() {
        return repo.findTop10ByOrderByScoreDesc();
    }

    @GetMapping("/leaderboard")
    public Iterable<BirdyFlapScore> getLeaderboard() {
        return repo.findAllByOrderByScoreDesc();
    }

    @PostMapping("/add")
    public String postScore(@RequestParam String username, @RequestParam int score) {
        String response = "failed adding score";
        
        BirdyFlapScore oldScore = repo.findByUsername(username);
        System.out.println(oldScore + " " +  score);
        if (oldScore != null && oldScore.getScore() < score) {
            System.out.println("Updating score...");
            response = "UPDATED highscore of: " + username;
            oldScore.setScore(score);
            oldScore.setDate(date.getDate());
            repo.save(oldScore);
        }
        else if (oldScore == null) {
            System.out.println("Adding new score...");
            response = "ADDED first highscore of: " + username;
            BirdyFlapScore newScore = new BirdyFlapScore();
            newScore.setUsername(username);
            newScore.setScore(score);
            newScore.setDate(date.getDate());
            repo.save(newScore);
        }

        return response;
    }
}
