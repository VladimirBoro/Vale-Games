package springboot.spring.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import springboot.spring.entities.Account;

@RepositoryRestResource
public interface AccountRepo extends JpaRepository<Account, Long> {
    boolean existsByUsername(String username);
}  