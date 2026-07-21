package com.leavemanagement.config;

import com.leavemanagement.entity.User;
import com.leavemanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")     private String adminEmail;
    @Value("${app.admin.password}")  private String adminPassword;
    @Value("${app.admin.firstName}") private String adminFirstName;
    @Value("${app.admin.lastName}")  private String adminLastName;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        enforceHrAdmin();
        createSampleEmployees();

        log.info("╔══════════════════════════════════════════════════╗");
        log.info("║           SYSTEM READY                          ║");
        log.info("╠══════════════════════════════════════════════════╣");
        log.info("║  HR Admin  → {}              ║", adminEmail);
        log.info("║  Password  → {}                        ║", adminPassword);
        log.info("║  40 Sample employees created              ║");
        log.info("║  All employee passwords: Employee@123     ║");
        log.info("╚══════════════════════════════════════════════════╝");
    }

    // ── HR Admin enforcement ──────────────────────────────────────────────────
    private void enforceHrAdmin() {
        List<User> existingAdmins = userRepository.findByRole(User.Role.HR_ADMIN);

        if (existingAdmins.isEmpty()) {
            userRepository.save(buildHrAdmin());
            log.info("[DataInitializer] HR Admin created: {}", adminEmail);
            return;
        }

        User existing = existingAdmins.get(0);
        if (!existing.getEmail().equalsIgnoreCase(adminEmail)) {
            log.info("[DataInitializer] HR Admin changed: {} → {}", existing.getEmail(), adminEmail);
            userRepository.deleteAll(existingAdmins);
            userRepository.save(buildHrAdmin());
        } else {
            existing.setPassword(passwordEncoder.encode(adminPassword));
            existing.setFirstName(adminFirstName);
            existing.setLastName(adminLastName);
            existing.setEnabled(true);
            userRepository.save(existing);
            log.info("[DataInitializer] HR Admin synced: {}", adminEmail);
        }
    }

    // ── 40 Sample Employees ───────────────────────────────────────────────────
    private void createSampleEmployees() {
        // Each entry: firstName, lastName, email, department, totalLeaveDays, usedLeaveDays, hireDateOffset(days ago)
        List<Object[]> employees = Arrays.asList(
            new Object[]{"Aarav",    "Sharma",    "aarav.sharma@company.com",    "Engineering",   20, 5,  365},
            new Object[]{"Priya",    "Patel",     "priya.patel@company.com",     "HR",            20, 3,  400},
            new Object[]{"Rohit",    "Kumar",     "rohit.kumar@company.com",     "Engineering",   20, 8,  200},
            new Object[]{"Sneha",    "Reddy",     "sneha.reddy@company.com",     "Marketing",     20, 2,  300},
            new Object[]{"Vikram",   "Singh",     "vikram.singh@company.com",    "Finance",       20, 6,  500},
            new Object[]{"Ananya",   "Gupta",     "ananya.gupta@company.com",    "Engineering",   20, 1,  150},
            new Object[]{"Arjun",    "Nair",      "arjun.nair@company.com",      "Sales",         20, 4,  600},
            new Object[]{"Kavya",    "Iyer",      "kavya.iyer@company.com",      "Engineering",   20, 7,  250},
            new Object[]{"Manish",   "Verma",     "manish.verma@company.com",    "Operations",    20, 3,  350},
            new Object[]{"Deepika",  "Joshi",     "deepika.joshi@company.com",   "Marketing",     20, 9,  450},
            new Object[]{"Suresh",   "Mehta",     "suresh.mehta@company.com",    "Finance",       20, 2,  700},
            new Object[]{"Pooja",    "Pillai",    "pooja.pillai@company.com",    "Engineering",   20, 5,  120},
            new Object[]{"Karthik",  "Rao",       "karthik.rao@company.com",     "Sales",         20, 0,  90},
            new Object[]{"Nisha",    "Menon",     "nisha.menon@company.com",     "HR",            20, 4,  800},
            new Object[]{"Rahul",    "Desai",     "rahul.desai@company.com",     "Engineering",   20, 11, 550},
            new Object[]{"Meera",    "Kaur",      "meera.kaur@company.com",      "Finance",       20, 6,  320},
            new Object[]{"Aditya",   "Bose",      "aditya.bose@company.com",     "Engineering",   20, 3,  180},
            new Object[]{"Lakshmi",  "Krishnan",  "lakshmi.krishnan@company.com","Operations",    20, 8,  420},
            new Object[]{"Vishal",   "Tiwari",    "vishal.tiwari@company.com",   "Marketing",     20, 2,  260},
            new Object[]{"Divya",    "Pandey",    "divya.pandey@company.com",    "Engineering",   20, 5,  380},
            new Object[]{"Ramesh",   "Agarwal",   "ramesh.agarwal@company.com",  "Finance",       20, 7,  640},
            new Object[]{"Swati",    "Shah",      "swati.shah@company.com",      "Sales",         20, 1,  210},
            new Object[]{"Abhishek", "Mishra",    "abhishek.mishra@company.com", "Engineering",   20, 4,  470},
            new Object[]{"Ritu",     "Srivastava","ritu.srivastava@company.com", "HR",            20, 3,  330},
            new Object[]{"Nikhil",   "Choudhary", "nikhil.choudhary@company.com","Operations",    20, 6,  510},
            new Object[]{"Pallavi",  "Nambiar",   "pallavi.nambiar@company.com", "Marketing",     20, 2,  170},
            new Object[]{"Sanjay",   "Dubey",     "sanjay.dubey@company.com",    "Engineering",   20, 9,  590},
            new Object[]{"Harini",   "Venkat",    "harini.venkat@company.com",   "Finance",       20, 4,  280},
            new Object[]{"Gaurav",   "Saxena",    "gaurav.saxena@company.com",   "Sales",         20, 0,  110},
            new Object[]{"Shruti",   "Banerjee",  "shruti.banerjee@company.com", "Engineering",   20, 7,  440},
            new Object[]{"Tushar",   "Jain",      "tushar.jain@company.com",     "Operations",    20, 5,  360},
            new Object[]{"Nandita",  "Das",       "nandita.das@company.com",     "Marketing",     20, 3,  230},
            new Object[]{"Siddharth","Ghosh",     "siddharth.ghosh@company.com", "Engineering",   20, 8,  670},
            new Object[]{"Yamini",   "Subramaniam","yamini.subramaniam@company.com","HR",         20, 2,  290},
            new Object[]{"Pankaj",   "Rastogi",   "pankaj.rastogi@company.com",  "Finance",       20, 6,  530},
            new Object[]{"Chitra",   "Mohan",     "chitra.mohan@company.com",    "Sales",         20, 1,  195},
            new Object[]{"Devesh",   "Kapoor",    "devesh.kapoor@company.com",   "Engineering",   20, 4,  415},
            new Object[]{"Aparna",   "Nair",      "aparna.nair@company.com",     "Operations",    20, 5,  345},
            new Object[]{"Sameer",   "Khanna",    "sameer.khanna@company.com",   "Marketing",     20, 3,  475},
            new Object[]{"Jyoti",    "Malhotra",  "jyoti.malhotra@company.com",  "Engineering",   20, 7,  620}
        );

        int created = 0;
        for (Object[] emp : employees) {
            String email = (String) emp[2];
            if (userRepository.existsByEmail(email)) continue;

            User user = new User();
            user.setFirstName((String) emp[0]);
            user.setLastName((String)  emp[1]);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("Employee@123"));
            user.setRole(User.Role.EMPLOYEE);
            user.setDepartment((String) emp[3]);
            user.setTotalLeaveDays((Integer) emp[4]);
            user.setUsedLeaveDays((Integer)  emp[5]);
            user.setHireDate(LocalDate.now().minusDays((Integer) emp[6]));
            user.setEnabled(true);

            userRepository.save(user);
            created++;
        }

        if (created > 0) log.info("[DataInitializer] {} sample employees created", created);
        else log.info("[DataInitializer] Sample employees already exist — skipped");
    }

    private User buildHrAdmin() {
        User user = new User();
        user.setEmail(adminEmail);
        user.setPassword(passwordEncoder.encode(adminPassword));
        user.setFirstName(adminFirstName);
        user.setLastName(adminLastName);
        user.setRole(User.Role.HR_ADMIN);
        user.setHireDate(LocalDate.now());
        user.setTotalLeaveDays(0);
        user.setUsedLeaveDays(0);
        user.setEnabled(true);
        return user;
    }
}
