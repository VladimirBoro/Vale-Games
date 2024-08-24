package springboot.spring.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import springboot.spring.entities.Account;
import springboot.spring.entities.AccountOauth2;
import springboot.spring.repo.AccountOauth2Repo;
import springboot.spring.repo.AccountRepo;
import springboot.spring.service.SessionService;
import springboot.spring.util.DateUtil;
import jakarta.servlet.http.HttpServletRequest;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.Value;
import com.google.api.client.json.JsonFactory;

@RestController 
public class AccountOauth2Controller {
    private BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
    
    @Autowired
    private AccountOauth2Repo accountOauth2Repo;
    
    @Autowired
    private AccountRepo accountRepo;

    @Value("${spring.datasource.password}")
    private String CLIENT_ID;
    
    private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private final HttpTransport transport = new NetHttpTransport();
    private DateUtil dateUtil = new DateUtil();
    private SessionService session = new SessionService();

    private String extractSubFromGoog(String credential) throws GeneralSecurityException, IOException {
        String sub = "";

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, JSON_FACTORY)
        // Specify the CLIENT_ID of the app that accesses the backend:
        .setAudience(Collections.singletonList(System.getenv("CLIENT_ID")))
        .build();

        GoogleIdToken idToken = verifier.verify(credential);
        if (idToken != null) {
            Payload payload = idToken.getPayload();
    
            // Print user identifier
            String userId = payload.getSubject();
            System.out.println("User ID: " + userId);
    
            // Get profile information from payload
            // String email = payload.getEmail();
            boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
            if (emailVerified) {
                sub = (String) payload.get("sub");
            }
        }
        else {
            System.out.println("Invalid ID token.");
        }

        return sub;
    }

    @PostMapping(path = "/login/google")
    public ResponseEntity<?> googleLogin(@RequestBody LoginRequest login, HttpServletRequest request) {
        String sub = "";
        try {
            sub = extractSubFromGoog(login.getcredential());
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String responseString = "register";
        List<AccountOauth2> accounts = accountOauth2Repo.findAll();

        for (AccountOauth2 account: accounts) {
            if (bcrypt.matches(sub, account.getHashSub())) {
                //target acquired
                responseString = session.startSession(account.getUsername(), request);
            }
        }
        System.out.println(login.getUsername() + " " + login.getcredential());

        return ResponseEntity.ok(responseString);
    }

    @PostMapping(path = "/register/google")
    public ResponseEntity<?> googleRegister(@RequestBody LoginRequest login) {
        String sub = "";
        String credential = login.getcredential();
        String username = login.getUsername();
        
        try {
            sub = extractSubFromGoog(credential);
            sub = bcrypt.encode(sub);
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (accountRepo.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.SC_UNPROCESSABLE_ENTITY).body("Username already in use");
        }
        
        // register googler user into our database boi
        Account account = new Account();
        account.setUsername(username);
        account.setAuth_method("googler");
        account.setCreated_at(dateUtil.getDate());
        accountRepo.save(account);
        
        AccountOauth2 accountOauth2 = new AccountOauth2();
        accountOauth2.setUsername(username);
        accountOauth2.setHashSub(sub);
        accountOauth2Repo.save(accountOauth2);

        return ResponseEntity.ok("registered");
    }

    private static class LoginRequest {
        private String credential;
        private String username;

        LoginRequest() {}

        LoginRequest(String credential) {
            this.credential = credential;
            this.username = "";
        }

        LoginRequest(String credential, String username) {
            this.credential = credential;
            this.username = username;
        }

        public String getUsername() {
            return username;
        }

        public String getcredential() {
            return credential;
        }

        public void setcredential(String credential) {
            this.credential = credential;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}
