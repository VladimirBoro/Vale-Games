package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.entities.JumpGuyScore;
import springboot.spring.repo.JumpGuyScoreRepo;
import springboot.spring.util.DateUtil;

@RestController
@RequestMapping(path = "/jumpguy")
public class JumpManScoreController {
    private DateUtil date = new DateUtil();

    @Autowired
    JumpGuyScoreRepo repo;

    @GetMapping("/leaderboard-top10")
    public Iterable<JumpGuyScore> getLeaderboardTop10() {
        return repo.findTop10ByOrderByScoreDesc();
    }

    @GetMapping("/leaderboard")
    public Iterable<JumpGuyScore> getLeaderboard() {
        return repo.findAllByOrderByScoreDesc();
    }

    @PostMapping("/add")
    public String postScore(@RequestParam String username, @RequestParam int score) {
        String response = "failed adding score";
        
        JumpGuyScore oldScore = repo.findByUsername(username);
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
            JumpGuyScore newScore = new JumpGuyScore();
            newScore.setUsername(username);
            newScore.setScore(score);
            newScore.setDate(date.getDate());
            repo.save(newScore);
        }

        return response;
    }
}
