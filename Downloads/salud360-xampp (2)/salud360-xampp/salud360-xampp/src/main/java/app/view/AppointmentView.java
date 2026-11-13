package app.view;

import app.domain.Appointment;

public class AppointmentView {
    public void showConfirmationCard(Appointment appointment) {
        System.out.println("==========================================");
        System.out.println("   ¡CITA MÉDICA AGENDADA CON ÉXITO!       ");
        System.out.println("==========================================");
        System.out.println(" ID Cita: " + appointment.getId());
        System.out.println(" Especialidad: " + appointment.getSpecialty());
        System.out.println(" Fecha y Hora: " + appointment.getDate() + " - " + appointment.getTime());
        System.out.println(" Sede Asignada: " + appointment.getAssignedLocation());
        System.out.println(" Estado: " + appointment.getState());
        System.out.println("==========================================");
    }

    public void showCancellationMessage(int id) {
        System.out.println("La cita con ID " + id + " ha sido cancelada exitosamente.");
    }
}
