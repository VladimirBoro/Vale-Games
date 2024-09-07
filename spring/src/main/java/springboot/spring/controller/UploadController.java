package springboot.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import springboot.spring.service.AccountService;
import springboot.spring.service.FileStorageService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/upload")
public class UploadController {
    private final FileStorageService fileStorageService;

    @Autowired
    private AccountService accountService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/profile_pic")
    public ResponseEntity<String> postProfilePic(@RequestParam String username, @RequestParam MultipartFile image) {
        System.out.println(username + " || " + image);
        String filename = fileStorageService.storeProfilePicture(username, image);
        return ResponseEntity.ok("Profile Pic uploaded " + filename);
    }
}
