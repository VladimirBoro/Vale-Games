package springboot.spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import springboot.spring.repo.MinesweeperScoreRepo;
import springboot.spring.util.DateUtil;
import springboot.spring.entities.MinesweeperScore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RestController
@RequestMapping("/minesweeper")
public class MinesweeperScoreController {
    private DateUtil date = new DateUtil();
    
    @Autowired
    private MinesweeperScoreRepo repo;

    private int timeInSeconds(String time) {
        String[] minuteAndSeconds = time.split(":");
        int minutes = Integer.parseInt(minuteAndSeconds[0]) * 60;
        int seconds = Integer.parseInt(minuteAndSeconds[1]);
        System.out.println(minutes + seconds);
        return minutes + seconds;
    }
    
    @PostMapping("/add")
    public String postScore(@RequestParam String username, @RequestParam String time) {
        MinesweeperScore oldTime = repo.findByUsername(username);
        if (oldTime != null && timeInSeconds(oldTime.getTime()) > timeInSeconds(time)) {
            oldTime.setTime(time);
            oldTime.setDate(date.getDate());
            repo.save(oldTime);

            return "updated winning time of " + username + " to table";
        }
        else if (oldTime == null) {
            MinesweeperScore timeObj = new MinesweeperScore();
            timeObj.setTime(time);
            timeObj.setUsername(username);
            timeObj.setDate(date.getDate());
            repo.save(timeObj);

            return "added winning time of " + username + " to table";
        }

        return "server failed to upload/update time";
    }

    @GetMapping("/leaderboard-top10")
    public @ResponseBody Iterable<MinesweeperScore> getTop10Leaderboard() {
        return repo.findTop10ByOrderByTime();
    }

    @GetMapping("/leaderboard")
    public @ResponseBody Iterable<MinesweeperScore> getLeaderboard() {
        return repo.findAll();
    }
}
