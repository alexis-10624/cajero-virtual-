// javascript/funciones.js - Lógica general del sistema y servicios médicos

// Almacén de resultados e historial de exámenes
let historialResultados = [];

// Variable global para almacenar el estado de la cita activa
let citaActual = {
    activa: false,
    especialidad: "",
    fecha: "",
    sede: ""
};

function cambiarSeccion(seccionId) {
    const secciones = ['home', 'dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'directorio', 'calificacion', 'auth'];
    
    const seccionesPrivadas = ['dashboard', 'citas', 'tramites', 'resultados', 'pagos', 'calificacion'];
    if (seccionesPrivadas.includes(seccionId) && !usuarioAutenticado) {
        mostrarModal("Acceso Restringido", "Debes iniciar sesión con tu cuenta para acceder a los servicios de salud.");
        seccionId = 'auth';
    }

    secciones.forEach(sec => {
        const elementoSec = document.getElementById(`sec-${sec}`);
        const navBtn = document.getElementById(`nav-${sec}`);
        
        if (elementoSec) {
            elementoSec.classList.add('hidden');
        }
        
        if (navBtn) {
            navBtn.className = "menu-item";
        }
    });

    const secActiva = document.getElementById(`sec-${seccionId}`);
    if (secActiva) {
        secActiva.classList.remove('hidden');
    }

    const activeNav = document.getElementById(`nav-${seccionId}`);
    if (activeNav) {
        activeNav.className = "menu-item activo";
    }
}

function actualizarInterfazAutenticada() {
    const userInfoHeader = document.getElementById('userInfoHeader');
    if (userInfoHeader) {
        userInfoHeader.classList.remove('hidden');
        userInfoHeader.classList.add('flex');
    }

    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        sidebarNav.classList.remove('hidden');
    }

    const headerUserName = document.getElementById('headerUserName');
    const dashUserName = document.getElementById('dashUserName');
    
    if (headerUserName) headerUserName.textContent = nombreUsuarioActual;
    if (dashUserName) dashUserName.textContent = nombreUsuarioActual;
    
    const btnAuth = document.getElementById('btnAuthHeader');
    if (btnAuth) {
        btnAuth.textContent = "Ir a mi Panel";
        btnAuth.onclick = function() { cambiarSeccion('dashboard'); };
        btnAuth.className = "btn btn-primario";
    }
}

// --- GESTIÓN DE CITAS Y GENERACIÓN DINÁMICA DE RESULTADOS ---
function agendarCita(e) {
    e.preventDefault();
    const especialidad = document.getElementById('especialidad').value;
    const fecha = document.getElementById('fechaCita').value;
    const sede = document.getElementById('sedeCita').value;

    // Actualizar objeto de cita activa
    citaActual = {
        activa: true,
        especialidad: especialidad,
        fecha: fecha,
        sede: sede
    };

    // Generar el resultado de laboratorio o diagnóstico según la especialidad seleccionada
    let nombreExamen = "";
    let detalleExamen = "";

    if (especialidad === "Medicina General") {
        nombreExamen = "Cuadro Hemático Completo";
        detalleExamen = "Valores de hemoglobina y leucocitos dentro de los parámetros normales. Sin signos de infección.";
    } else if (especialidad === "Optometría") {
        nombreExamen = "Examen de Agudeza Visual y Optometría";
        detalleExamen = "Diagnóstico: Leve astigmatismo bilateral. Se sugiere fórmula de lentes correctivos.";
    } else if (especialidad === "Odontología") {
        nombreExamen = "Valoración de Higiene Oral y Panorámica";
        detalleExamen = "Estado periodontal sano. Sin caries activas aparentes. Se recomienda control en 6 meses.";
    } else {
        nombreExamen = `Resultado de ${especialidad}`;
        detalleExamen = "Atención médica realizada con éxito. Parámetros estables.";
    }

    // Crear el nuevo registro de resultado
    const nuevoResultado = {
        id: Date.now(),
        examen: nombreExamen,
        especialidadAsociada: especialidad,
        fecha: fecha,
        detalle: detalleExamen
    };

    historialResultados.unshift(nuevoResultado); // Colocar al principio

    // Actualizar las vistas en la interfaz
    actualizarVistaCitaDashboard();
    actualizarVistaResultadosDashboard(nuevoResultado);
    renderizarListaResultados();

    mostrarModal("¡Cita Agendada con Éxito!", `Tu cita de ${especialidad} ha sido confirmada para el día ${fecha} en la ${sede}. Se ha generado un nuevo reporte de laboratorio.`);
    cambiarSeccion('dashboard');
}

// Actualizar la tarjeta de Cita en el Dashboard
function actualizarVistaCitaDashboard() {
    const tituloCita = document.getElementById('dashCitaTitulo');
    const fechaCita = document.getElementById('dashCitaFecha');
    const sedeCita = document.getElementById('dashCitaSede');
    const btnCancelar = document.getElementById('btnCancelarCita');

    if (!tituloCita) return;

    if (citaActual.activa) {
        tituloCita.textContent = citaActual.especialidad;
        fechaCita.textContent = `📅 ${citaActual.fecha}`;
        sedeCita.textContent = `🏥 ${citaActual.sede}`;
        if (btnCancelar) btnCancelar.classList.remove('hidden');
    } else {
        tituloCita.textContent = "No tienes citas activas";
        fechaCita.textContent = "📅 -";
        sedeCita.textContent = "🏥 -";
        if (btnCancelar) btnCancelar.classList.add('hidden');
    }
}

// Actualizar la tarjeta de Resultados en el Dashboard
function actualizarVistaResultadosDashboard(resultado) {
    const tituloExamen = document.getElementById('dashExamenTitulo');
    const fechaExamen = document.getElementById('dashExamenFecha');
    const estadoExamen = document.getElementById('dashExamenOk');
    const btnVer = document.getElementById('btnVerExamenDashboard');

    if (!tituloExamen) return;

    if (resultado) {
        tituloExamen.textContent = resultado.examen;
        fechaExamen.textContent = `📅 Cita: ${resultado.fecha}`;
        estadoExamen.textContent = "✔ Resultado Disponible";
        if (btnVer) btnVer.classList.remove('hidden');
    } else {
        tituloExamen.textContent = "Sin exámenes recientes";
        fechaExamen.textContent = "📅 -";
        estadoExamen.textContent = "ℹ️ Agenda una cita para generar resultados";
        if (btnVer) btnVer.classList.add('hidden');
    }
}

// Ver el detalle del resultado actual desde el Dashboard
function verResultadoActual() {
    if (historialResultados.length > 0) {
        const ultimo = historialResultados[0];
        verResultadoDetalle(ultimo.examen, ultimo.fecha, ultimo.detalle);
    }
}

// Renderizar la lista completa en la sección "Resultados de Laboratorio"
function renderizarListaResultados() {
    const contenedor = document.getElementById('contenedorResultadosLista');
    if (!contenedor) return;

    if (historialResultados.length === 0) {
        contenedor.innerHTML = `<p style="color: var(--gris); font-style: italic;">No tienes resultados de laboratorio registrados todavía.</p>`;
        return;
    }

    let htmlContenido = "";
    historialResultados.forEach(res => {
        htmlContenido += `
            <div style="background: #f8fafd; border: 1.5px solid var(--linea); border-radius: var(--radio-chico); padding: 18px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                <div>
                    <h4 style="font-size: 16px; font-weight: 800; color: var(--tinta); margin-bottom: 4px;">${res.examen}</h4>
                    <p style="font-size: 13.5px; color: var(--gris); margin-bottom: 4px;">Asociado a: <strong>${res.especialidadAsociada}</strong> | Fecha: ${res.fecha}</p>
                    <p style="font-size: 13.5px; color: var(--verde); font-weight: 700;">✔ Disponible para consulta</p>
                </div>
                <button onclick="verResultadoDetalle('${res.examen}', '${res.fecha}', '${res.detalle}')" class="btn btn-suave btn-chico">Ver Detalle</button>
            </div>
        `;
    });

    contenedor.innerHTML = htmlContenido;
}

// Función para solicitar confirmación antes de cancelar la cita
function confirmarCancelacionCita() {
    mostrarModal("Cancelar Cita", "¿Estás seguro de que deseas cancelar tu cita médica programada? Esta acción liberará el espacio.");
    
    const btnModalAceptar = document.querySelector('#modalAlert .btn-primario');
    if (btnModalAceptar) {
        btnModalAceptar.onclick = function() {
            ejecutarCancelacionCita();
        };
    }
}

// Ejecuta la cancelación efectiva de la cita
function ejecutarCancelacionCita() {
    citaActual.activa = false;
    actualizarVistaCitaDashboard();
    actualizarVistaResultadosDashboard(null);
    cerrarModal();

    const btnModalAceptar = document.querySelector('#modalAlert .btn-primario');
    if (btnModalAceptar) {
        btnModalAceptar.onclick = function() {
            cerrarModal();
        };
    }

    mostrarModal("Cita Cancelada", "Tu cita médica ha sido cancelada exitosamente.");
}

function descargarCertificado() {
    mostrarModal("Descarga Exitosa", "Su certificado de afiliación en PDF ha sido generado y descargado correctamente.");
}

function mostrarArchivoCargado() {
    const input = document.getElementById('ordenMedica');
    const nombre = document.getElementById('nombreArchivo');
    if (input && input.files.length > 0 && nombre) {
        nombre.textContent = `✔ Archivo adjunto: ${input.files[0].name}`;
    }
}

function verResultadoDetalle(examen, fecha, detalle) {
    mostrarModal(`Resultado: ${examen}`, `Fecha del examen: ${fecha}\nDiagnóstico: ${detalle}`);
}

// --- PASARELA DE PAGOS CON BANCOS Y MODAL DE CONFIRMACIÓN ---
function iniciarPagoPasarela() {
    const selectBanco = document.getElementById('select-banco');
    const bancoSeleccionado = selectBanco ? selectBanco.value : "";

    if (!bancoSeleccionado) {
        mostrarModal("Selección Requerida", "Por favor, selecciona una entidad bancaria para continuar con el pago de tu cuota moderadora.");
        return;
    }

    const bancoTxt = document.getElementById('bancoSeleccionadoTxt');
    if (bancoTxt) {
        bancoTxt.textContent = bancoSeleccionado;
    }

    const modalConfirmacion = document.getElementById('modalConfirmacionPago');
    if (modalConfirmacion) {
        modalConfirmacion.classList.remove('hidden');
    }
}

function cerrarModalConfirmacionPago() {
    const modalConfirmacion = document.getElementById('modalConfirmacionPago');
    if (modalConfirmacion) {
        modalConfirmacion.classList.add('hidden');
    }
}

function ejecutarPagoFinal() {
    const selectBanco = document.getElementById('select-banco');
    const banco = selectBanco ? selectBanco.value : "su banco";

    cerrarModalConfirmacionPago();

    if (selectBanco) selectBanco.value = "";

    mostrarModal("Pago Exitoso (PSE)", `La transacción de su cuota moderadora por valor de $4.500 se ha realizado con éxito a través de ${banco}.`);
    cambiarSeccion('dashboard');
}

function calificar(estrellas) {
    const mensajeCalificacion = document.getElementById('mensajeCalificacion');
    if (mensajeCalificacion) {
        mensajeCalificacion.textContent = `Has seleccionado ${estrellas} de 5 estrellas. ¡Gracias por tu opinión!`;
    }
}

function enviarCalificacion() {
    mostrarModal("¡Muchas Gracias!", "Su calificación ha sido enviada con éxito.");
    cambiarSeccion('dashboard');
}

function cambiarTabAuth(tab) {
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    const tabLogin = document.getElementById('tab-login');
    const tabRegistro = document.getElementById('tab-registro');

    if (tab === 'login') {
        if (formLogin) formLogin.classList.remove('hidden');
        if (formRegistro) formRegistro.classList.add('hidden');
        if (tabLogin) tabLogin.className = "tab activa";
        if (tabRegistro) tabRegistro.className = "tab";
    } else {
        if (formLogin) formLogin.classList.add('hidden');
        if (formRegistro) formRegistro.classList.remove('hidden');
        if (tabRegistro) tabRegistro.className = "tab activa";
        if (tabLogin) tabLogin.className = "tab";
    }
}

function mostrarModal(titulo, mensaje) {
    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const modalAlert = document.getElementById('modalAlert');

    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalMensaje) modalMensaje.textContent = mensaje;
    if (modalAlert) modalAlert.classList.remove('hidden');
}

function cerrarModal() {
    const modalAlert = document.getElementById('modalAlert');
    if (modalAlert) modalAlert.classList.add('hidden');
}