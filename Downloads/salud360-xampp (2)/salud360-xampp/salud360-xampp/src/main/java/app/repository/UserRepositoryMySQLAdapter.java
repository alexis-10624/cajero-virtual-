package app.repository;

import app.configuration.DatabaseConnection;
import app.domain.User;
import app.service.outputports.UserRepository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserRepositoryMySQLAdapter implements UserRepository {

    @Override
    public User save(User user) {
        String sql = "INSERT INTO users (name, document_type, document_number, email, phone, password, affiliation_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, user.getName());
            stmt.setString(2, user.getDocumentType());
            stmt.setString(3, user.getDocumentNumber());
            stmt.setString(4, user.getEmail());
            stmt.setString(5, user.getPhone());
            stmt.setString(6, user.getPassword());
            stmt.setString(7, user.getAffiliationStatus());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        user.setId(generatedKeys.getInt(1));
                    }
                }
            }
            return user;
        } catch (SQLException e) {
            System.err.println("Error al guardar el usuario en MySQL (XAMPP): " + e.getMessage());
            return null;
        }
    }

    @Override
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("document_type"),
                            rs.getString("document_number"),
                            rs.getString("email"),
                            rs.getString("phone"),
                            rs.getString("password"),
                            rs.getString("affiliation_status")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al buscar usuario por correo en MySQL: " + e.getMessage());
        }
        return null;
    }

    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM users";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                users.add(new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("document_type"),
                        rs.getString("document_number"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("password"),
                        rs.getString("affiliation_status")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Error al listar usuarios en MySQL: " + e.getMessage());
        }
        return users;
    }
}
