
// javascript/principal.js - Inicializador principal de la aplicación

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    
    if (formLogin) formLogin.reset();
    if (formRegistro) formRegistro.reset();

    // Comprobar persistencia activa en localStorage
    const sesionGuardada = localStorage.getItem('sesionActivaSalud360');
    if (sesionGuardada) {
        const datosUsuario = JSON.parse(sesionGuardada);
        usuarioAutenticado = true;
        nombreUsuarioActual = datosUsuario.nombre;
        
        actualizarInterfazAutenticada();
        cambiarSeccion('dashboard');
    } else {
        const userInfoHeader = document.getElementById('userInfoHeader');
        const sidebarNav = document.getElementById('sidebarNav');

        if (userInfoHeader) {
            userInfoHeader.classList.add('hidden');
            userInfoHeader.classList.remove('flex');
        }
        if (sidebarNav) {
            sidebarNav.classList.add('hidden');
        }
        cambiarSeccion('home');
    }

    console.log("Salud 360 - Estructura modular en español inicializada correctamente");
});

document.addEventListener("DOMContentLoaded", async () => {
    const vistas = ['home', 'auth', 'dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'directorio', 'calificacion'];
    
    for (const vista of vistas) {
        try {
            const respuesta = await fetch(`views/${vista}.html`);
            if (respuesta.ok) {
                const html = await respuesta.text();
                const contenedor = document.getElementById(`vista-${vista}`);
                if (contenedor) contenedor.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error cargando la vista ${vista}:`, error);
        }
    }

    // Inicializar el flujo normal de sesión y secciones...
});

