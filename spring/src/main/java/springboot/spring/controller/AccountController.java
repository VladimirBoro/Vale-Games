package springboot.spring.controller;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class AccountController {

    @GetMapping (path = "/test")
    public String test(HttpSession session) {
        return "USER: " + session.getAttribute("username");
    }

    @PostMapping (path = "/logout/valegames")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String responseString = "Logout success";
        HttpSession session = request.getSession(false);

        System.out.println("wtffff");

        // failed
        if (session == null) {
            responseString = "Couldn't logout user";
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(responseString);
        }

        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(responseString + " || CONTEXTUAL:: " + SecurityContextHolder.getContext());
    }
}
