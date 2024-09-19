package springboot.spring.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="jumpguy_score")
public class JumpGuyScore {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;

    @Column (unique = true)
    private String username;

    private long score;
    private String date;
}