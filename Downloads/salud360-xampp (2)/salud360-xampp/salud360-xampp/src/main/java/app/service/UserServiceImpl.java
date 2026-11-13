package app.service;

import app.domain.User;
import app.service.inputports.UserService;
import app.service.outputports.UserRepository;

public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(String name, String docType, String docNum, String email, String phone, String password) {
        User newUser = new User(name, docType, docNum, email, phone, password);
        return userRepository.save(newUser);
    }

    @Override
    public boolean login(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }
}
