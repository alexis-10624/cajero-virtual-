package app.configuration;

public class Config {
    public static final String APP_NAME = "Salud 360";
    public static final String VERSION = "2.0.0-XAMPP";

    // Configuración por defecto de MySQL en XAMPP
    public static final String DB_URL = "jdbc:mysql://localhost:3306/salud360?useSSL=false&serverTimezone=America/Bogota&allowPublicKeyRetrieval=true";
    public static final String DB_USER = "root";
    public static final String DB_PASSWORD = ""; // En XAMPP por defecto la contraseña de root es vacía
}
