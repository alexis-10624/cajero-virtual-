package app.service.outputports;

import app.domain.Appointment;
import java.util.List;

public interface AppointmentRepositoryPort {
    Appointment save(Appointment appointment);
    List<Appointment> findByUserId(int userId);
    boolean cancelAppointment(int id, int userId);
}
