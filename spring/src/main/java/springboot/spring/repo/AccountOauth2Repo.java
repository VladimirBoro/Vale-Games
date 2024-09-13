package springboot.spring.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import springboot.spring.entities.AccountOauth2;

@RepositoryRestResource
public interface AccountOauth2Repo extends JpaRepository<AccountOauth2, Long> {
    List<AccountOauth2> findByHashSub(String hashSub);
    boolean existsByUsername(String username);
    AccountOauth2 findByUsername(String username);
}  