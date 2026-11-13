package app.service;

import app.domain.Appointment;
import app.service.inputports.AppointmentServiceInterface;
import app.service.outputports.AppointmentRepositoryPort;

import java.time.LocalDate;
import java.util.List;

public class AppointmentServiceAdapter implements AppointmentServiceInterface {
    private final AppointmentRepositoryPort appointmentRepository;

    public AppointmentServiceAdapter(AppointmentRepositoryPort appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment scheduleAppointment(int userId, String specialty, LocalDate date, String time, String location) {
        Appointment newAppointment = new Appointment(0, userId, specialty, date, time, location);
        return appointmentRepository.save(newAppointment);
    }

    @Override
    public List<Appointment> getPatientAppointments(int userId) {
        return appointmentRepository.findByUserId(userId);
    }

    @Override
    public boolean cancelAppointment(int appointmentId, int userId) {
        return appointmentRepository.cancelAppointment(appointmentId, userId);
    }
}
