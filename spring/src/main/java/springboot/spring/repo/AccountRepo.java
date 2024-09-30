package springboot.spring.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import springboot.spring.entities.Account;

@RepositoryRestResource
public interface AccountRepo extends JpaRepository<Account, Long> {
    boolean existsByUsername(String username);
    Account findByUsername(String username);
    
    @Query("SELECT account.created_at FROM Account account WHERE account.username = :username")
    String findCreatedAtByUsername(String username);
}  