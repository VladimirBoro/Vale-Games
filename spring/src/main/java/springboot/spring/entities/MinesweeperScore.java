package springboot.spring.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table (name = "minesweeper_score")
public class MinesweeperScore {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column (unique = true)
    private String username;

    private String time;
    private String date;
}
