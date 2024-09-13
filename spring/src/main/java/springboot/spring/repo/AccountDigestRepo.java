package springboot.spring.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import springboot.spring.entities.AccountDigest;

@RepositoryRestResource
public interface AccountDigestRepo extends JpaRepository<AccountDigest, Long> {
    public AccountDigest findByUsername(String username); 
    public AccountDigest findByPassword(String password);
}  