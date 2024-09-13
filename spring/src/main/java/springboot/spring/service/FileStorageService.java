package springboot.spring.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    public String storeProfilePicture(String username, MultipartFile file) {
        return storeProfilePictureLocally(username, file);
    }

    public String updateProfilePicture(String oldPath, String username, MultipartFile file) {
        System.out.println("updating pp " + oldPath);
        return storeProfilePictureLocally(username, file);

        
    }

    public String storeProfilePictureLocally(String username, MultipartFile file) {
        String type = file.getContentType().split("/")[1];
        String filename = username + "_profilePic." + type;
        System.out.println("FILENAME: " + filename + " ");

        try {
            Path uploadDirectory = Paths.get("./spring/uploads/profile_pictures");
            Path targetLocation = uploadDirectory.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return targetLocation.toString();
        } 
        catch (Exception e) {
            throw new RuntimeException("Could not store file locally...");
        }
    }

    public void updateUsername(String newUsername, String oldfilePath) {

    }

    // we gonna need a function to store pic in CDN or something later too.
}
