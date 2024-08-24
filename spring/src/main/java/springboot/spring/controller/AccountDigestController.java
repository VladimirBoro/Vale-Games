package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import springboot.spring.entities.Account;
import springboot.spring.entities.AccountDigest;
import springboot.spring.repo.AccountDigestRepo;
import springboot.spring.repo.AccountRepo;
import springboot.spring.service.SessionService;
import springboot.spring.util.DateUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
public class AccountDigestController {
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private DateUtil dateUtil = new DateUtil();
    private SessionService session = new SessionService();
    
    @Autowired
    AccountDigestRepo accountDigestRepo;
    
    @Autowired
    AccountRepo accountRepo;
    
    @PostMapping(path = "/login/valegames")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println(loginRequest.getUsername() + " " + loginRequest.getPassword());
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        AccountDigest user = accountDigestRepo.findByUsername(username);
        
        // invalid username or password
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Invalid username or password");
        }

        String response = session.startSession(user.getUsername(), request);
        
        return ResponseEntity.ok(response);
    }
        
    @PostMapping(path = "/register/valegames")
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest loginRequest) {
        // first make sure that username is not taken
        // return code 422 if already exists
        String username = loginRequest.getUsername();
        // AccountDigest accountCheck = accountDigestRepo.findByUsername(username);
        
        if (accountRepo.existsByUsername(username)) {
            // username exists! return 422 back
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Username already exists");
        }
        
        // bcrpyt le password
        String hashedPassword = passwordEncoder.encode(loginRequest.getPassword());

        Account account = new Account();
        account.setUsername(username);
        account.setAuth_method("valegames");
        account.setCreated_at(dateUtil.getDate());
        accountRepo.save(account);
        
        // register user with username and password
        AccountDigest accountDigest = new AccountDigest();
        accountDigest.setUsername(username);
        accountDigest.setPassword(hashedPassword);
        accountDigestRepo.save(accountDigest);
        
        return ResponseEntity.ok("registered user");
    }


    private static class LoginRequest {
        private String username;
        private String password;
    
        public LoginRequest() {}
    
        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }
    
        public String getUsername() {
            return username;
        }
    
        public void setUsername(String username) {
            this.username = username;
        }
    
        public String getPassword() {
            return password;
        }
    
        public void setPassword(String password) {
            this.password = password;
        }
    }
}
