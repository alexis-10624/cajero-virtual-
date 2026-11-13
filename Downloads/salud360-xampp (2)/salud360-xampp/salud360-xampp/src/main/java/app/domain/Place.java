package app.domain;

public class Place {
    private int id;
    private String name;
    private String address;
    private String emergencyPhone;

    public Place(int id, String name, String address, String emergencyPhone) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.emergencyPhone = emergencyPhone;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public String getEmergencyPhone() { return emergencyPhone; }
}
