package springboot.spring.controller;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.api.client.util.Value;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import springboot.spring.util.LoginRequest;
import springboot.spring.service.AccountService;


@RestController
public class AccountController {

    @Value("${spring.datasource.password}")
    private String CLIENT_ID;

    @Autowired
    private AccountService accountService;

    @GetMapping (path = "/test")
    public String test(HttpSession session) {
        return "USER: " + session.getAttribute("username");
    }

    @GetMapping("/account/profilePicture")
    public ResponseEntity<Resource> getProfilePicture(@RequestParam String username) {
        return ResponseEntity.internalServerError().build();
    }
    
    @PostMapping (path = "/logout/valegames")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        System.out.println("loggin out");
        try {
            String response = accountService.logout(request);
            return ResponseEntity.ok(response);
        }   
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("Failed to logout");
        }
    }

    @PostMapping(path = "/login/valegames")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            String response = accountService.login(loginRequest, request);
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Invalid username or password");
        }
    }

    @PostMapping(path = "/register/valegames")
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest loginRequest) {
        try {
            String response = accountService.registerUser(loginRequest);
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Failed to register");
        }
    }
}
