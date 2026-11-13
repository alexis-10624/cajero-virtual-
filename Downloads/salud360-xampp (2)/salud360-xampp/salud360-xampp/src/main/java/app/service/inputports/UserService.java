package app.service.inputports;

import app.domain.User;

public interface UserService {
    User registerUser(String name, String docType, String docNum, String email, String phone, String password);
    boolean login(String email, String password);
}
