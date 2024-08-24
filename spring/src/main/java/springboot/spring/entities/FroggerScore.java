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
@Table(name = "frogger_score")
public class FroggerScore {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    long id;

    @Column (unique = true)
    private String username;

    private long score;
    private String date;
}
