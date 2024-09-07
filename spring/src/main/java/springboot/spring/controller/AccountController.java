package springboot.spring.controller;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
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

    @GetMapping ("/test")
    public String test(HttpSession session) {
        return "USER: " + session.getAttribute("username");
    }

    @GetMapping("/account/profilePicture")
    public ResponseEntity<Resource> getProfilePicture(@RequestParam String username) {
        System.out.println("getting " + username + "'s pp");
        return accountService.getProfilePicture(username);
    }
    
    @PostMapping ("/logout/valegames")
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

    @PostMapping("/login/valegames")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            String response = accountService.login(loginRequest, request);
            System.out.println("login response " + response + " | " + loginRequest.getUsername());

            if (response.equals("register")) {
                return ResponseEntity.ok(response);
            }
            else if (loginRequest.getType().equals("valegames") && !response.equals(loginRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Invalid username or password");
            }

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Invalid username or password");
        }
    }

    @PostMapping("/register/valegames")
    public ResponseEntity<?> registerUser(  @RequestParam("username") String username,
                                            @RequestParam("password") String credential,
                                            @RequestParam(value = "image", required = false) MultipartFile image,
                                            @RequestParam("type") String type ) {

        accountService.registerUser(username, credential, image, type);
        return ResponseEntity.ok("Registered user " + username);
    }

    @PostMapping("/account/delete")
    public ResponseEntity<?> deleteUser(@RequestParam String username, HttpServletRequest request) {
        System.out.println("deleting user now");
        try {
            accountService.deleteUser(username, request);
            return ResponseEntity.ok("deleted user" + username);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Failed to delete account");
        }
    }

    @PostMapping("/account/update")
    public ResponseEntity<?> updateUser(@RequestParam(value = "oldUsername", required = false) String oldUsername,
                                        @RequestParam(value = "newUsername", required = false) String newUsername,
                                        @RequestParam(value = "image", required = false) MultipartFile image ) {
        
        accountService.updateUser(oldUsername, newUsername, image);
        return ResponseEntity.ok("updated account");
    }
    
}
