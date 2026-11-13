# Salud 360 - Versión con Persistencia en MySQL (XAMPP)

Proyecto adaptado manteniendo exactamente la misma **Arquitectura Hexagonal (Puertos y Adaptadores)** del proyecto original, reemplazando las listas en memoria (`ArrayList`) por adaptadores JDBC hacia **MySQL / MariaDB en XAMPP**.

## Pasos para ejecutarlo con XAMPP

1. **Iniciar XAMPP:**
   - Abre el **XAMPP Control Panel**.
   - Inicia los módulos **Apache** y **MySQL**.

2. **Crear la base de datos en phpMyAdmin:**
   - Abre `http://localhost/phpmyadmin` en tu navegador.
   - Ve a la pestaña **Importar** (o **SQL**) y ejecuta el archivo `database/salud360.sql` incluido en este ZIP.
   - Esto creará la base de datos `salud360` con las tablas `users`, `appointments`, `doctors` y `places`.

3. **Configurar credenciales (opcional):**
   - Por defecto XAMPP usa el usuario `root` sin contraseña (`""`) en el puerto `3306`.
   - Si cambiaste tu usuario, contraseña o puerto de MySQL, edita `src/main/java/app/configuration/Config.java`.

4. **Ejecutar el proyecto Java:**
   - Abre la carpeta `salud360-xampp` en IntelliJ IDEA (como proyecto Maven) para que descargue automáticamente la dependencia `mysql-connector-j` definida en el `pom.xml`.
   - Ejecuta la clase `app.Application`.
