package springboot.spring.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
import springboot.spring.exceptions.UsernameAlreadyExistsException;
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

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ScoreService scoreService;

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
    
    public void registerUser(String username, String credential, MultipartFile image, String type) {
        String response = "";
        
        // RETURN SOME TYPE OF ERROR RESPONSE (422?)
        if (accountRepo.existsByUsername(username)) {
            System.out.println("user already exists!");
            throw new UsernameAlreadyExistsException("username " + username + " already exists");
        }

        System.out.println("TYPE " + type);
        if (type.equals("google")) {
            System.out.println("googly");
            response = googleRegister(username, credential, image);
        }
        else
        {
            System.out.println("locally");
            response = valeGamesRegister(username, credential, image);
        }

        String imageLocation = "";
        boolean isCustomPic = true;
        if (image == null) {
            int defaultPicNumber = (int)(Math.random() * 6) + 1;
            String basePath = "./spring/src/main/resources/static/default_profile_pictures";
            isCustomPic = false;
            imageLocation = basePath + "/default_" + defaultPicNumber + ".png";
        }
        else {
            imageLocation = fileStorageService.storeProfilePicture(username, image);
        }

        Account account = new Account();
        account.setUsername(username);
        account.setAuth_method(type);
        account.setCreated_at(dateUtil.getDate());
        account.setProfile_pic(imageLocation);
        account.setPictureCustom(isCustomPic);
        accountRepo.save(account);
    }

    private String googleRegister(String username, String credential, MultipartFile image) {
        String response = "registered user";

        String sub = "";
        
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

        
        AccountOauth2 accountOauth2 = new AccountOauth2();
        accountOauth2.setUsername(username);
        accountOauth2.setHashSub(sub);
        accountOauth2Repo.save(accountOauth2);

        return response;
    }

    private String valeGamesRegister(String username, String password, MultipartFile image) {
        String response = "registered user";


        if (image != null) {
            System.out.println("(IMAGE) yo im not null!");
        }
        
        // bcrpyt le password
        String hashedPassword = bcrypt.encode(password);

        // register user with username and password
        AccountDigest accountDigest = new AccountDigest();
        accountDigest.setUsername(username);
        accountDigest.setPassword(hashedPassword);
        accountDigestRepo.save(accountDigest);

        return response;
    }

    public ResponseEntity<Resource> getProfilePicture(String username) {
        Account account = accountRepo.findByUsername(username);
        String pathToPicture = account.getProfile_pic();
        
        try {
            // Define the path to your image folder
            Path imagePath = Paths.get(pathToPicture).normalize();
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                // Set response headers to make the browser treat it as an image file
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    public String deleteUser(String username, HttpServletRequest request) {
        // logout to destroy session
        logout(request);
        System.out.println("deleting " + username);
        // now delete user info from tables
        Account account = accountRepo.findByUsername(username);
        try {
            if (account.isPictureCustom()) {
                Path profilePicPath = Paths.get(account.getProfile_pic());
                Files.deleteIfExists(profilePicPath);
            }

            if (account.getAuth_method().equals("valegames")) {
                AccountDigest accountDigest = accountDigestRepo.findByUsername(username);
                accountDigestRepo.delete(accountDigest);
            }
            else {
                AccountOauth2 accountOauth2 = accountOauth2Repo.findByUsername(username);
                accountOauth2Repo.delete(accountOauth2);
            }

            accountRepo.delete(account);
            return "yuh";
        }
        catch (Exception e) {
            return "error";
        }

    }

    public String updateUser(String oldUsername, String newUsername, MultipartFile image) {
        if (!oldUsername.equals(newUsername)) {
            System.out.println("updating username... " + oldUsername + " " + newUsername);
            boolean updatingImage = image == null ? false : true;

            updateUsername(oldUsername, newUsername, updatingImage); 
        }
        
        if (image != null) {
            System.out.println("updating imagey...");
            
            if (newUsername.equals(oldUsername) || newUsername == null || newUsername.equals("")) {
                System.out.println("old image update");
                updateProfilePicture(oldUsername, image);
            }
            else {
                System.out.println("new image update");
                updateProfilePicture(newUsername, image);
            }
        }
        
        return "success updating account";
    }

    private void updateUsername(String oldUsername, String newUsername, boolean updatingImage) {
        Account exisitingAccount = accountRepo.findByUsername(newUsername);
        if (exisitingAccount != null) {
            System.out.println("ballin!");
            throw new UsernameAlreadyExistsException("Username " + newUsername + " is taken.");
        }
        
        // handle associated data too, so all of the datatables and shiet
        Account account = accountRepo.findByUsername(oldUsername);
        account.setUsername(newUsername);
        accountRepo.save(account);
        
        if (account.getAuth_method().equals("valegames")) {
            AccountDigest accountDigest = accountDigestRepo.findByUsername(oldUsername);
            accountDigest.setUsername(newUsername);
            accountDigestRepo.save(accountDigest);
        }
        else {
            AccountOauth2 accountOauth2 = accountOauth2Repo.findByUsername(oldUsername);
            accountOauth2.setUsername(newUsername);
            accountOauth2Repo.save(accountOauth2);
        }
        
        scoreService.updateUsername(oldUsername, newUsername);
        
        // update filename here!
        if (account.isPictureCustom() || updatingImage) {
            // update name
            String currentPicturePath = account.getProfile_pic();
            String imageExtension = currentPicturePath.substring(currentPicturePath.lastIndexOf("."));
            String newName = newUsername + "_profilePic" + imageExtension;

            String basePath = currentPicturePath.substring(0, currentPicturePath.lastIndexOf("\\"));
            String newPicturePath = basePath + "\\" + newName;

            File oldPicture = new File(currentPicturePath);
            File newPicture = new File(newPicturePath);
            System.out.println(newPicturePath + " " + newPicture);
            oldPicture.renameTo(newPicture);
        }
    }

    private void updateProfilePicture(String username, MultipartFile image) {
        Account account = accountRepo.findByUsername(username);
        account.setPictureCustom(true);
        account.setProfile_pic(fileStorageService.storeProfilePicture(username, image));
        accountRepo.save(account);
    }

}
