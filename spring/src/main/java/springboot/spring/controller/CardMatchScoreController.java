package springboot.spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.entities.CardMatchScore;
import springboot.spring.repo.CardMatchScoreRepo;
import springboot.spring.util.DateUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/cardmatch")
public class CardMatchScoreController {
    private DateUtil date = new DateUtil();

    @Autowired
    private CardMatchScoreRepo cardMatchScoreRepo;

    private int timeInSeconds(String time) {
        String[] minuteAndSeconds = time.split(":");
        int minutes = Integer.parseInt(minuteAndSeconds[0]) * 60;
        int seconds = Integer.parseInt(minuteAndSeconds[1]);
        System.out.println(minutes + seconds);
        return minutes + seconds;
    }

    @PostMapping("/add")
    public String postMethodName(@RequestParam String username, @RequestParam String time) {
        CardMatchScore oldTime = cardMatchScoreRepo.findByUsername(username);
        if (oldTime != null && timeInSeconds(oldTime.getTime()) > timeInSeconds(time)) {
            oldTime.setTime(time);
            oldTime.setDate(date.getDate());
            cardMatchScoreRepo.save(oldTime);

            return "updated winning time of " + username + " to table";
        }
        else if (oldTime == null) {
            CardMatchScore timeObj = new CardMatchScore();
            timeObj.setTime(time);
            timeObj.setUsername(username);
            timeObj.setDate(date.getDate());
            cardMatchScoreRepo.save(timeObj);

            return "added winning time of " + username + " to table";
        }

        return "server failed to upload/update time";
    }
    
    @GetMapping("/leaderboard-top10")
    public Iterable<CardMatchScore> getTop10() {
        return cardMatchScoreRepo.findTop10ByOrderByTime();
    }

    @GetMapping("/leaderboard")
    public @ResponseBody Iterable<CardMatchScore> getLeaderboard() {
        return cardMatchScoreRepo.findAll();
    }
}
