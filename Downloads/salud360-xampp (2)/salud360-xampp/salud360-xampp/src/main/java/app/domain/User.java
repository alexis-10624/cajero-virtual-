package app.domain;

public class User extends Person {
    private int id;
    private String password;
    private String affiliationStatus;

    public User(String name, String documentType, String documentNumber, String email, String phone, String password) {
        super(name, documentType, documentNumber, email, phone);
        this.password = password;
        this.affiliationStatus = "Afiliado Activo";
    }

    public User(int id, String name, String documentType, String documentNumber, String email, String phone, String password, String affiliationStatus) {
        super(name, documentType, documentNumber, email, phone);
        this.id = id;
        this.password = password;
        this.affiliationStatus = affiliationStatus;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getPassword() { return password; }
    public String getAffiliationStatus() { return affiliationStatus; }
    public void setAffiliationStatus(String affiliationStatus) { this.affiliationStatus = affiliationStatus; }
}
