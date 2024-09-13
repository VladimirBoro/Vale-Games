package springboot.spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionController {
    @GetMapping (path = "/")
    public ResponseEntity<?> isSessionActive() {
        return ResponseEntity.ok("Session still good");
    }
}
