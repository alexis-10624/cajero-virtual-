package app;

import app.configuration.DatabaseConnection;
import app.domain.Appointment;
import app.domain.Place;
import app.domain.User;
import app.repository.AppointmentRepositoryMySQLAdapter;
import app.repository.UserRepositoryMySQLAdapter;
import app.service.AppointmentServiceAdapter;
import app.service.UserServiceImpl;
import app.service.inputports.AppointmentServiceInterface;
import app.service.inputports.UserService;
import app.service.outputports.AppointmentRepositoryPort;
import app.service.outputports.UserRepository;
import app.view.AppointmentView;
import app.view.UserView;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Application {
    public static void main(String[] args) {
        // Verificar conexión con MySQL de XAMPP antes de iniciar
        try (Connection testConn = DatabaseConnection.getConnection()) {
            System.out.println("[OK] Conexión establecida correctamente con MySQL (XAMPP - BD: salud360).");
        } catch (SQLException e) {
            System.err.println("[ERROR] No se pudo conectar a MySQL en XAMPP.");
            System.err.println("Asegúrese de iniciar Apache y MySQL en XAMPP y ejecutar el script database/salud360.sql");
            System.err.println("Detalle: " + e.getMessage());
            return;
        }

        Scanner scanner = new Scanner(System.in);

        UserRepository userRepository = new UserRepositoryMySQLAdapter();
        UserService userService = new UserServiceImpl(userRepository);
        UserView userView = new UserView();

        AppointmentRepositoryPort appointmentRepository = new AppointmentRepositoryMySQLAdapter();
        AppointmentServiceInterface appointmentService = new AppointmentServiceAdapter(appointmentRepository);
        AppointmentView appointmentView = new AppointmentView();

        boolean running = true;

        System.out.println("==========================================");
        System.out.println("   BIENVENIDO A PLATAFORMA SALUD 360      ");
        System.out.println("==========================================");

        User currentUser = null;

        while (running) {
            if (currentUser == null) {
                System.out.println("\n--- MENÚ DE ACCESO ---");
                System.out.println("1. Registrarse");
                System.out.println("2. Iniciar Sesión");
                System.out.println("3. Salir");
                System.out.print("Seleccione una opción: ");
                int option = scanner.nextInt();
                scanner.nextLine();

                switch (option) {
                    case 1:
                        System.out.print("Nombre completo: ");
                        String name = scanner.nextLine();
                        System.out.print("Digita qué documento usas (CC, TI, etc.): ");
                        String docType = scanner.nextLine();
                        System.out.print("Número de documento: ");
                        String docNum = scanner.nextLine();
                        System.out.print("Correo electrónico: ");
                        String email = scanner.nextLine();
                        System.out.print("Teléfono: ");
                        String phone = scanner.nextLine();
                        System.out.print("Contraseña: ");
                        String password = scanner.nextLine();

                        User registered = userService.registerUser(name, docType, docNum, email, phone, password);
                        if (registered != null && registered.getId() > 0) {
                            currentUser = registered;
                            System.out.println("¡Registro exitoso!");
                            userView.showWelcomeMessage(currentUser);
                        } else {
                            System.out.println("No se pudo completar el registro (verifique que el correo o documento no estén repetidos).");
                        }
                        break;

                    case 2:
                        System.out.print("Correo electrónico: ");
                        String loginEmail = scanner.nextLine();
                        System.out.print("Contraseña: ");
                        String loginPass = scanner.nextLine();

                        boolean success = userService.login(loginEmail, loginPass);
                        if (success) {
                            currentUser = userRepository.findByEmail(loginEmail);
                            System.out.println("¡Inicio de sesión exitoso!");
                            userView.showWelcomeMessage(currentUser);
                        } else {
                            System.out.println("Error: Correo o contraseña incorrectos.");
                        }
                        break;

                    case 3:
                        running = false;
                        System.out.println("Saliendo de Salud 360. ¡Hasta pronto!");
                        break;
                    default:
                        System.out.println("Opción inválida.");
                }
            } else {
                System.out.println("\n--- PANEL PRINCIPAL ---");
                System.out.println("Afiliado: " + currentUser.getName() + " (ID: " + currentUser.getId() + ") | Estado: " + currentUser.getAffiliationStatus());
                System.out.println("1. Agendar Cita Médica (Presencial / Virtual)");
                System.out.println("2. Ver y Cancelar mis Citas Activas");
                System.out.println("3. Consultar Resultados de Laboratorio");
                System.out.println("4. Directorio de Sedes y Urgencias");
                System.out.println("5. Cerrar Sesión");
                System.out.print("Seleccione el servicio que necesita: ");
                int serviceOption = scanner.nextInt();
                scanner.nextLine();

                switch (serviceOption) {
                    case 1:
                        System.out.println("\n--- AGENDAMIENTO DE CITA ---");
                        System.out.print("Elija Especialidad (1. Medicina General / 2. Especialistas): ");
                        int espOpt = scanner.nextInt();
                        scanner.nextLine();
                        String especialidad = (espOpt == 1) ? "Medicina General" : "Especialistas";

                        // Cargar sedes dinámicamente desde la base de datos de XAMPP
                        List<Place> sedesList = new ArrayList<>();
                        String sqlPlaces = "SELECT * FROM places";
                        try (Connection conn = DatabaseConnection.getConnection();
                             Statement stmt = conn.createStatement();
                             ResultSet rs = stmt.executeQuery(sqlPlaces)) {
                            while (rs.next()) {
                                sedesList.add(new Place(
                                        rs.getInt("id"),
                                        rs.getString("name"),
                                        rs.getString("address"),
                                        rs.getString("emergency_phone")
                                ));
                            }
                        } catch (SQLException e) {
                            System.err.println("Error al cargar las sedes: " + e.getMessage());
                        }

                        if (sedesList.isEmpty()) {
                            System.out.println("No hay sedes registradas en el sistema.");
                            break;
                        }

                        System.out.println("\n--- SELECCIONE UNA SEDE ---");
                        for (int i = 0; i < sedesList.size(); i++) {
                            Place p = sedesList.get(i);
                            System.out.println((i + 1) + ". " + p.getName() + " (" + p.getAddress() + ")");
                        }
                        System.out.print("Ingrese el número de la sede deseada: ");
                        int sedeOpt = scanner.nextInt();
                        scanner.nextLine();

                        if (sedeOpt < 1 || sedeOpt > sedesList.size()) {
                            System.out.println("Opción de sede inválida. Operación cancelada.");
                            break;
                        }

                        String sedeSeleccionada = sedesList.get(sedeOpt - 1).getName();

                        Appointment nuevaCita = appointmentService.scheduleAppointment(
                                currentUser.getId(),
                                especialidad,
                                LocalDate.now().plusDays(2),
                                "10:00 AM",
                                sedeSeleccionada
                        );
                        if (nuevaCita != null) {
                            appointmentView.showConfirmationCard(nuevaCita);
                        }
                        break;

                    case 2:
                        System.out.println("\n--- MIS CITAS PROGRAMADAS ---");
                        List<Appointment> citas = appointmentService.getPatientAppointments(currentUser.getId());
                        if (citas.isEmpty()) {
                            System.out.println("No tienes citas registradas en este momento.");
                        } else {
                            for (Appointment app : citas) {
                                System.out.println("ID: " + app.getId() + " | " + app.getSpecialty() + " | Fecha: " + app.getDate() + " | Sede: " + app.getAssignedLocation() + " | Estado: " + app.getState());
                            }
                            System.out.print("Ingrese el ID de la cita que desea cancelar (o 0 para salir): ");
                            int idCancelar = scanner.nextInt();
                            scanner.nextLine();
                            if (idCancelar != 0) {
                                boolean cancelada = appointmentService.cancelAppointment(idCancelar, currentUser.getId());
                                if (cancelada) {
                                    appointmentView.showCancellationMessage(idCancelar);
                                } else {
                                    System.out.println("No se encontró una cita activa con ese ID asociada a tu cuenta.");
                                }
                            }
                        }
                        break;

                    case 3:
                        System.out.println("\n--- RESULTADOS E HISTORIAL CLÍNICO ---");
                        System.out.println("- Examen de Sangre General (Fecha: 10 Feb) -> [Resultado Normal.pdf]");
                        System.out.println("- Examen de Glicemia (Fecha: 15 Mar) -> [Resultado OK.pdf]");
                        break;

                    case 4:
                        System.out.println("\n--- DIRECTORIO DE SEDES Y URGENCIAS ---");
                        System.out.println("* Sede Central Medellín: Calle 50 #45-12 | Urgencias: 604-1234567");
                        System.out.println("* Sede Norte (Bello): Diagonal 55 #20-30 | Urgencias: 604-9876543");
                        break;

                    case 5:
                        currentUser = null;
                        System.out.println("Sesión cerrada correctamente.");
                        break;

                    default:
                        System.out.println("Opción no válida en el panel.");
                }
            }
        }
        scanner.close();
    }
}