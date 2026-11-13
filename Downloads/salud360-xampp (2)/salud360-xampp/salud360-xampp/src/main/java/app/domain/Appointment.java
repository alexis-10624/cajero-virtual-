package app.domain;

import app.domain.enums.AppointmentStateEnum;
import java.time.LocalDate;

public class Appointment {
    private int id;
    private int userId;
    private String specialty;
    private LocalDate date;
    private String time;
    private String assignedLocation;
    private AppointmentStateEnum state;

    public Appointment(int id, int userId, String specialty, LocalDate date, String time, String assignedLocation) {
        this.id = id;
        this.userId = userId;
        this.specialty = specialty;
        this.date = date;
        this.time = time;
        this.assignedLocation = assignedLocation;
        this.state = AppointmentStateEnum.ACTIVE;
    }

    public Appointment(int id, int userId, String specialty, LocalDate date, String time, String assignedLocation, AppointmentStateEnum state) {
        this.id = id;
        this.userId = userId;
        this.specialty = specialty;
        this.date = date;
        this.time = time;
        this.assignedLocation = assignedLocation;
        this.state = state;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public String getSpecialty() { return specialty; }
    public LocalDate getDate() { return date; }
    public String getTime() { return time; }
    public String getAssignedLocation() { return assignedLocation; }
    public AppointmentStateEnum getState() { return state; }
    public void setState(AppointmentStateEnum state) { this.state = state; }
}
