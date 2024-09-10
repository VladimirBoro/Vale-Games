package springboot.spring.service;

import java.io.IOException;
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
        Path path = Paths.get(oldPath);
        try {
            System.out.println("updating pp " + path + " " + Files.deleteIfExists(path));
            // Files.deleteIfExists(path);
            return storeProfilePictureLocally(username, file);
        }
        catch (IOException e) {
            return e.toString();
        }
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
