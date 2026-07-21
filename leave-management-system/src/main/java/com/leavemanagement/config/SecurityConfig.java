package com.leavemanagement.config;

import com.leavemanagement.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final OncePerRequestFilter jwtAuthFilter;

    public SecurityConfig(UserService userService,
                          PasswordEncoder passwordEncoder,
                          OncePerRequestFilter jwtAuthFilter) {
        this.userService     = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuthFilter   = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            // Disable Spring Security's own CORS — handled by CorsConfig servlet filter
            .cors(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/auth/login", "/auth/register").permitAll()
                .requestMatchers("/auth/validate").authenticated()
                .requestMatchers("/users/me/**").authenticated()
                .requestMatchers("/users/all").authenticated() 
                .requestMatchers(HttpMethod.POST,   "/leaves").authenticated()
                .requestMatchers(HttpMethod.GET,    "/leaves/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/leaves/**").authenticated()
//                .requestMatchers("/manager/**").hasAnyRole("MANAGER", "HR_ADMIN")
//                .requestMatchers("/hr/**").hasRole("HR_ADMIN")
                .requestMatchers("/manager/**").hasRole("HR_ADMIN")
                .requestMatchers("/hr/**").hasRole("HR_ADMIN")
                .requestMatchers("/users/{id}").hasAnyRole("MANAGER", "HR_ADMIN")
                .requestMatchers("/users/{id}/leave-balance").hasAnyRole("MANAGER", "HR_ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}