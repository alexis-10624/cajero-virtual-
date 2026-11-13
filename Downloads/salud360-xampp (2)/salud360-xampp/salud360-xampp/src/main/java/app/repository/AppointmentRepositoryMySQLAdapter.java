package app.repository;

import app.configuration.DatabaseConnection;
import app.domain.Appointment;
import app.domain.enums.AppointmentStateEnum;
import app.service.outputports.AppointmentRepositoryPort;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AppointmentRepositoryMySQLAdapter implements AppointmentRepositoryPort {

    @Override
    public Appointment save(Appointment appointment) {
        String sql = "INSERT INTO appointments (user_id, specialty, appointment_date, appointment_time, assigned_location, state) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, appointment.getUserId());
            stmt.setString(2, appointment.getSpecialty());
            stmt.setDate(3, Date.valueOf(appointment.getDate()));
            stmt.setString(4, appointment.getTime());
            stmt.setString(5, appointment.getAssignedLocation());
            stmt.setString(6, appointment.getState().name());

            int affectedRows = stmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        appointment.setId(generatedKeys.getInt(1));
                    }
                }
            }
            return appointment;
        } catch (SQLException e) {
            System.err.println("Error al agendar cita en MySQL (XAMPP): " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<Appointment> findByUserId(int userId) {
        List<Appointment> appointments = new ArrayList<>();
        String sql = "SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    appointments.add(new Appointment(
                            rs.getInt("id"),
                            rs.getInt("user_id"),
                            rs.getString("specialty"),
                            rs.getDate("appointment_date").toLocalDate(),
                            rs.getString("appointment_time"),
                            rs.getString("assigned_location"),
                            AppointmentStateEnum.valueOf(rs.getString("state"))
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al consultar citas en MySQL: " + e.getMessage());
        }
        return appointments;
    }

    @Override
    public boolean cancelAppointment(int id, int userId) {
        String sql = "UPDATE appointments SET state = ? WHERE id = ? AND user_id = ? AND state = 'ACTIVE'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, AppointmentStateEnum.CANCELLED.name());
            stmt.setInt(2, id);
            stmt.setInt(3, userId);

            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            System.err.println("Error al cancelar cita en MySQL: " + e.getMessage());
            return false;
        }
    }
}
