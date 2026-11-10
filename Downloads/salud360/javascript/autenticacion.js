// javascript/autenticacion.js - Lógica de Autenticación y Usuarios

let usuarioAutenticado = false;
let nombreUsuarioActual = "";

// --- LOGIN SEGURO ---
function iniciarSesion(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosSalud360')) || [];
    const usuarioEncontrado = usuariosRegistrados.find(u => u.correo === email && u.password === password);

    if (usuarioEncontrado) {
        usuarioAutenticado = true;
        nombreUsuarioActual = usuarioEncontrado.nombre;
        
        // Guardar persistencia en localStorage
        localStorage.setItem('sesionActivaSalud360', JSON.stringify({ nombre: nombreUsuarioActual, correo: email }));

        actualizarInterfazAutenticada();
        mostrarModal("Bienvenido de nuevo", `Has ingresado como ${nombreUsuarioActual}.`);
        cambiarSeccion('dashboard');
    } else {
        mostrarModal("Error de Autenticación", "Correo o contraseña incorrectos. Por favor, verifica tus datos o regístrate si no tienes cuenta.");
    }
}

// --- REGISTRO SEGURO CON CONTRASEÑA ---
function registrarUsuario(e) {
    e.preventDefault();
    
    const nombreInput = document.getElementById('regNombre');
    const tipoDocInput = document.getElementById('regTipoDoc');
    const numDocInput = document.getElementById('regNumDoc');
    const emailInput = document.getElementById('regEmail');
    const telefonoInput = document.getElementById('regTelefono');
    const passwordInput = document.getElementById('regPassword');

    const nombre = nombreInput ? nombreInput.value.trim() : "";
    const tipoDoc = tipoDocInput ? tipoDocInput.value : "";
    const numDoc = numDocInput ? numDocInput.value.trim() : "";
    const correo = emailInput ? emailInput.value.trim() : "";
    const telefono = telefonoInput ? telefonoInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!nombre || !numDoc || !correo || !telefono || !password) {
        mostrarModal("Campos Incompletos", "Por favor, completa todos los campos obligatorios para crear tu cuenta.");
        return;
    }

    let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosSalud360')) || [];

    const existeCorreo = usuariosRegistrados.some(u => u.correo === correo);
    if (existeCorreo) {
        mostrarModal("Correo ya registrado", "Este correo electrónico ya se encuentra asociado a una cuenta. Intenta iniciar sesión.");
        return;
    }

    const nuevoUsuario = {
        nombre: nombre,
        tipoDoc: tipoDoc,
        numDoc: numDoc,
        correo: correo,
        telefono: telefono,
        password: password
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuariosSalud360', JSON.stringify(usuariosRegistrados));

    usuarioAutenticado = true;
    nombreUsuarioActual = nombre;
    
    // Guardar persistencia de sesión
    localStorage.setItem('sesionActivaSalud360', JSON.stringify({ nombre: nombreUsuarioActual, correo: correo }));

    actualizarInterfazAutenticada();
    mostrarModal("¡Registro Exitoso!", `Tu cuenta ha sido creada correctamente, ${nombreUsuarioActual}. ¡Bienvenido!`);
    cambiarSeccion('dashboard');
}

// --- CERRAR SESIÓN ---
function cerrarSesion() {
    usuarioAutenticado = false;
    nombreUsuarioActual = "";
    
    localStorage.removeItem('sesionActivaSalud360');
    
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (userInfoHeader) {
        userInfoHeader.classList.add('hidden');
        userInfoHeader.classList.remove('flex');
    }

    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        sidebarNav.classList.add('hidden');
    }
    
    const btnAuth = document.getElementById('btnAuthHeader');
    if (btnAuth) {
        btnAuth.textContent = "Iniciar Sesión / Registro";
        btnAuth.onclick = function() { cambiarSeccion('auth'); };
        btnAuth.className = "btn btn-primario";
    }
    
    mostrarModal("Sesión Finalizada", "Has salido del portal de afiliados correctamente.");
    cambiarSeccion('home');
}
