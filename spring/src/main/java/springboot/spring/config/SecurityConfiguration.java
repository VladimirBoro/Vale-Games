package springboot.spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                .requestMatchers("/login/**", "/register/**", "/logout/**", "/frogger/leaderboard**", 
                    "/snake/leaderboard/**", "/minesweeper/leaderboard", "/cardmatch/leaderboard-top10", 
                    "/birdyflap/leaderboard-top10", "/jumpguy/leaderboard**")
                    .permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(formLogin -> 
                formLogin
                .disable()
            )
            .sessionManagement(session -> session
                .maximumSessions(1)
            )
            .csrf(AbstractHttpConfigurer::disable);

            return http.build();
        }
        
        @Bean
        public UserDetailsService userDetailsService() {
            return new InMemoryUserDetailsManager();
        }

    }