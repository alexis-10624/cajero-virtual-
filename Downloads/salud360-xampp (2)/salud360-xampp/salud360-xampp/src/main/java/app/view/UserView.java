package app.view;

import app.domain.User;

public class UserView {
    public void showWelcomeMessage(User user) {
        System.out.println("¡Bienvenido a Salud 360, " + user.getName() + "! Estado de cuenta: " + user.getAffiliationStatus());
    }
}
