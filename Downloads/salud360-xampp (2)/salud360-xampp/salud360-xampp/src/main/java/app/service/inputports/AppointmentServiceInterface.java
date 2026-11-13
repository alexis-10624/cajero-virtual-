package app.service.inputports;

import app.domain.Appointment;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentServiceInterface {
    Appointment scheduleAppointment(int userId, String specialty, LocalDate date, String time, String location);
    List<Appointment> getPatientAppointments(int userId);
    boolean cancelAppointment(int appointmentId, int userId);
}
