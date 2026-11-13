package app.service.outputports;

import app.domain.User;
import java.util.List;

public interface UserRepository {
    User save(User user);
    User findByEmail(String email);
    List<User> findAll();
}
