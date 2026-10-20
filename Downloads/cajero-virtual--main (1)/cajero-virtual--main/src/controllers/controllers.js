import { dbClientes, getUsuarioLogueado, setUsuarioLogueado } from '../data/database.js';
import { Cliente } from '../models/Cliente.js';
import { actualizarMenu, renderLanding, renderLogin, renderRegister, renderDashboard, renderSaldo, renderConsignar, renderRetirar, renderTransferir, renderTarjeta, renderMovimientos, renderPerfil, renderAdmin } from '../views/views.js';

export function router(view, params = {}) {
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    actualizarMenu(router);

    switch(view) {
        case 'landing': container.innerHTML = renderLanding(); break;
        case 'login': container.innerHTML = renderLogin(); break;
        case 'register': container.innerHTML = renderRegister(); break;
        case 'dashboard': container.innerHTML = renderDashboard(); break;
        case 'saldo': container.innerHTML = renderSaldo(); break;
        case 'consignar': container.innerHTML = renderConsignar(); break;
        case 'retirar': container.innerHTML = renderRetirar(); break;
        case 'movimientos': container.innerHTML = renderMovimientos(); break;
        case 'transferir': container.innerHTML = renderTransferir(); break;
        case 'tarjeta': container.innerHTML = renderTarjeta(); break;
        case 'perfil': container.innerHTML = renderPerfil(); break;
        case 'admin': container.innerHTML = renderAdmin(); break;
        default: container.innerHTML = renderLanding();
    }
}

export function cerrarSesion() {
    setUsuarioLogueado(null);
    router('landing');
}

export function toggleDestinoInput(val) {
    if (val === 'propia') {
        document.getElementById('group-destino-propio').classList.remove('hidden');
        document.getElementById('group-destino-tercero').classList.add('hidden');
    } else {
        document.getElementById('group-destino-propio').classList.add('hidden');
        document.getElementById('group-destino-tercero').classList.remove('hidden');
    }
}

export function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const alertDiv = document.getElementById('login-alert');

    const cliente = dbClientes.find(c => c.username === user);

    if (!cliente) {
        alertDiv.innerHTML = `<div class="alert alert-error">El usuario no existe en el sistema.</div>`;
        return;
    }

    if (cliente.bloqueado) {
        alertDiv.innerHTML = `<div class="alert alert-error">Esta cuenta se encuentra bloqueada por exceso de intentos fallidos.</div>`;
        return;
    }

    if (cliente.verificarPassword(pass)) {
        cliente.intentosFallidos = 0;
        setUsuarioLogueado(cliente);
        router('dashboard');
    } else {
        cliente.intentosFallidos++;
        const intentosRestantes = 3 - cliente.intentosFallidos;
        if (cliente.intentosFallidos >= 3) {
            cliente.bloqueado = true;
            alertDiv.innerHTML = `<div class="alert alert-error">Cuenta bloqueada. Ha superado los 3 intentos fallidos permitidos.</div>`;
        } else {
            alertDiv.innerHTML = `<div class="alert alert-error">Contraseña incorrecta. Intentos fallidos: ${cliente.intentosFallidos}/3. Te quedan ${intentosRestantes} intentos.</div>`;
        }
    }
}

export function handleRegister(e) {
    e.preventDefault();
    const id = document.getElementById('reg-id').value.trim();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const cel = document.getElementById('reg-cel').value.trim();
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const alertDiv = document.getElementById('reg-alert');

    if (dbClientes.some(c => c.username === user)) {
        alertDiv.innerHTML = `<div class="alert alert-error">El nombre de usuario ya está en uso. Elija otro.</div>`;
        return;
    }

    if (dbClientes.some(c => c.identificacion === id)) {
        alertDiv.innerHTML = `<div class="alert alert-error">Ya existe un cliente registrado con esta identificación.</div>`;
        return;
    }

    const nuevoCliente = new Cliente(id, nombre, cel, user, pass);
    dbClientes.push(nuevoCliente);
    alertDiv.innerHTML = `<div class="alert alert-success">¡Registro exitoso! Ya puedes iniciar sesión.</div>`;
    setTimeout(() => router('login'), 1500);
}

export function handleConsignar(e) {
    e.preventDefault();
    const prod = document.getElementById('consignar-producto').value;
    const monto = parseFloat(document.getElementById('consignar-monto').value);
    const alertDiv = document.getElementById('consignar-alert');
    const usuarioLogueado = getUsuarioLogueado();

    try {
        let cuenta = prod === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
        cuenta.consignar(monto);
        alertDiv.innerHTML = `<div class="alert alert-success">Consignación exitosa. Nuevo saldo: $${cuenta.saldo.toFixed(2)}</div>`;
        document.getElementById('consignar-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

export function handleRetirar(e) {
    e.preventDefault();
    const prod = document.getElementById('retirar-producto').value;
    const monto = parseFloat(document.getElementById('retirar-monto').value);
    const alertDiv = document.getElementById('retirar-alert');
    const usuarioLogueado = getUsuarioLogueado();

    try {
        let cuenta = prod === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
        cuenta.retirar(monto);
        alertDiv.innerHTML = `<div class="alert alert-success">Retiro exitoso. Nuevo saldo: $${cuenta.saldo.toFixed(2)}</div>`;
        document.getElementById('retirar-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

export function handleTransfer(e) {
    e.preventDefault();
    const origenKey = document.getElementById('trans-origen').value;
    const tipoDestino = document.getElementById('trans-tipo-destino').value;
    const monto = parseFloat(document.getElementById('trans-monto').value);
    const alertDiv = document.getElementById('transfer-alert');
    const usuarioLogueado = getUsuarioLogueado();

    if (monto <= 0) {
        alertDiv.innerHTML = `<div class="alert alert-error">El monto debe ser mayor a cero.</div>`;
        return;
    }

    let cuentaOrigen = origenKey === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
    let cuentaDestino = null;

    if (tipoDestino === 'propia') {
        const destinoPropioKey = document.getElementById('trans-destino-propio').value;
        if (origenKey === destinoPropioKey) {
            alertDiv.innerHTML = `<div class="alert alert-error">Restricción: No se permiten transferencias al mismo producto.</div>`;
            return;
        }
        cuentaDestino = destinoPropioKey === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
    } else {
        const usernameTercero = document.getElementById('trans-username-tercero').value.trim();
        const cuentaTerceroKey = document.getElementById('trans-cuenta-tercero').value;

        if (usernameTercero === usuarioLogueado.username) {
            alertDiv.innerHTML = `<div class="alert alert-error">Para transferir a tus cuentas usa la opción "Mi otro producto".</div>`;
            return;
        }

        const tercero = dbClientes.find(c => c.username === usernameTercero);
        if (!tercero) {
            alertDiv.innerHTML = `<div class="alert alert-error">El usuario destino no existe.</div>`;
            return;
        }
        cuentaDestino = cuentaTerceroKey === 'ahorros' ? tercero.cuentaAhorros : tercero.cuentaCorriente;
    }

    try {
        cuentaOrigen.retirar(monto);
        cuentaDestino.consignar(monto);
        cuentaOrigen.movimientos[0].tipo = "Transferencia Enviada";
        cuentaDestino.movimientos[0].tipo = "Transferencia Recibida";

        alertDiv.innerHTML = `<div class="alert alert-success">¡Transferencia realizada con éxito!</div>`;
        document.getElementById('trans-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

export function handleTarjetaCompra(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('tc-monto').value);
    const cuotas = parseInt(document.getElementById('tc-cuotas').value);
    const alertDiv = document.getElementById('tc-alert');
    const usuarioLogueado = getUsuarioLogueado();

    try {
        const cuotaMensual = usuarioLogueado.tarjetaCredito.comprarAcuotas(monto, cuotas);
        alertDiv.innerHTML = `<div class="alert alert-success">Compra exitosa a ${cuotas} cuotas. Valor cuota mensual: $${cuotaMensual.toFixed(2)}</div>`;
        document.getElementById('tc-monto').value = '';
        document.getElementById('tc-cuotas').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

export function handleUpdatePerfil(e) {
    e.preventDefault();
    const usuarioLogueado = getUsuarioLogueado();
    usuarioLogueado.nombreCompleto = document.getElementById('perfil-nombre').value.trim();
    usuarioLogueado.celular = document.getElementById('perfil-cel').value.trim();
    document.getElementById('perfil-alert').innerHTML = `<div class="alert alert-success">Perfil actualizado correctamente.</div>`;
}

export function handleChangePassword(e) {
    e.preventDefault();
    const actual = document.getElementById('pass-actual').value;
    const nueva = document.getElementById('pass-nueva').value;
    const confirmar = document.getElementById('pass-confirmar').value;
    const alertDiv = document.getElementById('perfil-alert');
    const usuarioLogueado = getUsuarioLogueado();

    if (!usuarioLogueado.verificarPassword(actual)) {
        alertDiv.innerHTML = `<div class="alert alert-error">La contraseña actual es incorrecta.</div>`;
        return;
    }

    if (nueva !== confirmar) {
        alertDiv.innerHTML = `<div class="alert alert-error">La nueva contraseña y su confirmación no coinciden.</div>`;
        return;
    }

    usuarioLogueado.password = nueva;
    alertDiv.innerHTML = `<div class="alert alert-success">Contraseña cambiada exitosamente.</div>`;
    document.getElementById('pass-actual').value = '';
    document.getElementById('pass-nueva').value = '';
    document.getElementById('pass-confirmar').value = '';
}

export function editarClientePrompt(username) {
    const cliente = dbClientes.find(c => c.username === username);
    if (!cliente) return;
    const nuevoNombre = prompt("Nuevo nombre completo:", cliente.nombreCompleto);
    const nuevoCel = prompt("Nuevo celular:", cliente.celular);
    if (nuevoNombre) cliente.nombreCompleto = nuevoNombre;
    if (nuevoCel) cliente.celular = nuevoCel;
    router('admin');
}

export function eliminarCliente(username) {
    const usuarioLogueado = getUsuarioLogueado();
    if (usuarioLogueado && usuarioLogueado.username === username) {
        alert("No puedes eliminar tu propia cuenta activa.");
        return;
    }
    if (confirm(`¿Estás seguro de eliminar al usuario ${username}?`)) {
        let index = dbClientes.findIndex(c => c.username === username);
        if (index !== -1) dbClientes.splice(index, 1);
        router('admin');
    }
}