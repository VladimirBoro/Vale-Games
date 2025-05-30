package springboot.spring.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table (name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;

    @Column(unique = true)
    private String username;
    
    private String auth_method;
    private String created_at;
    private boolean pictureCustom;
    private String profile_pic;
    private boolean deleted;
}
