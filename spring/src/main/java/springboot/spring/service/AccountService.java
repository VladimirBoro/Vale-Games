package springboot.spring.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.Value;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import springboot.spring.entities.Account;
import springboot.spring.entities.AccountDigest;
import springboot.spring.entities.AccountOauth2;
import springboot.spring.repo.AccountDigestRepo;
import springboot.spring.repo.AccountOauth2Repo;
import springboot.spring.repo.AccountRepo;
import springboot.spring.util.DateUtil;
import springboot.spring.util.LoginRequest;

@Service
public class AccountService {
    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private AccountDigestRepo accountDigestRepo;

    @Autowired
    private AccountOauth2Repo accountOauth2Repo;

    @Value("${spring.datasource.password}")
    private String CLIENT_ID;
    
    private BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
    private SessionService session = new SessionService();
    private DateUtil dateUtil = new DateUtil();

    private final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private final HttpTransport transport = new NetHttpTransport();   

    public String login(LoginRequest loginRequest, HttpServletRequest request) {
        String response = "";

        System.out.println("TYPE " + loginRequest.getType());
        if (loginRequest.getType().equals("google")) {
            System.out.println("googly");
            response = googleLogin(loginRequest, request);
        }
        else
        {
            System.out.println("locally");
            response = valeGamesLogin(loginRequest, request);
        }

        return response;
    }

    private String valeGamesLogin(LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println(loginRequest.getUsername() + " " + loginRequest.getPassword());
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        System.out.println(username + " " + password);
        AccountDigest user = accountDigestRepo.findByUsername(username);
        
        // invalid username or password
        if (user == null || !bcrypt.matches(password, user.getPassword())) {
            return "Invalid username or password";
        }

        String response = session.startSession(user.getUsername(), request);
        
        return response;
    }

    private String googleLogin(LoginRequest loginRequest, HttpServletRequest request) {
        String sub = "";
        try {
            sub = extractSubFromGoog(loginRequest.getPassword());
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

        return responseString;
    }

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

    public String logout(HttpServletRequest request) {
        String response = "Logout success";
        HttpSession session = request.getSession(false);

        // failed
        if (session == null) {
            response = "Couldn't logout user";
            return response;
        }

        session.invalidate();
        SecurityContextHolder.clearContext();

        return response;
    }

    public String registerUser(LoginRequest request) {
        String response = "";

        System.out.println("TYPE " + request.getType());
        if (request.getType().equals("google")) {
            System.out.println("googly");
            response = googleRegister(request);
        }
        else
        {
            System.out.println("locally");
            response = valeGamesRegister(request);
        }

        return response;
    }

    private String googleRegister(LoginRequest request) {
        String response = "registered user";

        String sub = "";
        String credential = request.getPassword();
        String username = request.getUsername();
        
        System.out.println(username + " " + credential);
        try {
            sub = extractSubFromGoog(credential);
            sub = bcrypt.encode(sub);
        } catch (GeneralSecurityException e) {
            response = e.toString();
            e.printStackTrace();
        } catch (IOException e) {
            response = e.toString();
            e.printStackTrace();
        }

        if (accountRepo.existsByUsername(username)) {
            response = "Username already in use";
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

        return response;
    }

    private String valeGamesRegister(LoginRequest request) {
        String response = "registered user";

        String username = request.getUsername();
        // AccountDigest accountCheck = accountDigestRepo.findByUsername(username);
        
        if (accountRepo.existsByUsername(username)) {
            // username exists! return 422 back
            response = "Username already exists";
        }
        
        // bcrpyt le password
        String hashedPassword = bcrypt.encode(request.getPassword());

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

        return response;
    }

}
