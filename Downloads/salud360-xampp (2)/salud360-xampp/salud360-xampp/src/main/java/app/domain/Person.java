package app.domain;

public class Person {
    protected String name;
    protected String documentType;
    protected String documentNumber;
    protected String email;
    protected String phone;

    public Person(String name, String documentType, String documentNumber, String email, String phone) {
        this.name = name;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.email = email;
        this.phone = phone;
    }

    public String getName() { return name; }
    public String getDocumentType() { return documentType; }
    public String getDocumentNumber() { return documentNumber; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
}
