
class Cliente {
    constructor(identificacion, nombreCompleto, celular, username, password) {
        this.identificacion = identificacion;
        this.nombreCompleto = nombreCompleto;
        this.celular = celular;
        this.username = username;
        this.password = password;
        this.intentosFallidos = 0;
        this.bloqueado = false;
        
        this.cuentaAhorros = new CuentaAhorros(100000, "CA-" + identificacion);
        this.cuentaCorriente = new CuentaCorriente(500000, "CC-" + identificacion);
        this.tarjetaCredito = new TarjetaCredito(2000000, "TC-" + identificacion);
    }

    verificarPassword(pass) {
        return this.password === pass;
    }
}

class Cuenta {
    constructor(saldoInicial, numeroCuenta) {
        if (this.constructor === Cuenta) {
            throw new Error("No se puede instanciar la clase abstracta Cuenta directamente.");
        }
        this._saldo = saldoInicial;
        this.numeroCuenta = numeroCuenta;
        this.movimientos = [];
    }

    get saldo() {
        return this._saldo;
    }

    consignar(monto) {
        if (monto <= 0) throw new Error("El monto a consignar debe ser mayor a cero.");
        this._saldo += monto;
        this.registrarMovimiento("Consignación", monto);
        return this._saldo;
    }

    retirar(monto) {
        throw new Error("Método retirar debe ser implementado por la subclase.");
    }

    registrarMovimiento(tipo, valor) {
        const fechaHora = new Date().toLocaleString();
        this.movimientos.unshift({ fechaHora, tipo, valor });
    }
}

class CuentaAhorros extends Cuenta {
    constructor(saldoInicial, numeroCuenta) {
        super(saldoInicial, numeroCuenta);
    }

    retirar(monto) {
        if (monto <= 0) throw new Error("El monto debe ser mayor a cero.");
        const interes = monto * 0.015;
        const totalDescontar = monto + interes;

        if (totalDescontar > this._saldo) {
            throw new Error(`Saldo insuficiente. Incluyendo el interés del retiro (1.5%: $${interes.toFixed(2)}), el total requerido es $${totalDescontar.toFixed(2)}.`);
        }
        this._saldo -= totalDescontar;
        this.registrarMovimiento("Retiro (con 1.5% interés)", totalDescontar);
        return this._saldo;
    }
}

class CuentaCorriente extends Cuenta {
    constructor(saldoInicial, numeroCuenta) {
        super(saldoInicial, numeroCuenta);
    }

    retirar(monto) {
        if (monto <= 0) throw new Error("El monto debe ser mayor a cero.");
        const limiteSobregiro = this._saldo * 1.20;

        if (monto > limiteSobregiro) {
            throw new Error(`El monto supera el límite permitido con sobregiro del 20% (Máximo retiro: $${limiteSobregiro.toFixed(2)}).`);
        }
        this._saldo -= monto;
        this.registrarMovimiento("Retiro (Corriente c/ Sobregiro)", monto);
        return this._saldo;
    }
}

class TarjetaCredito {
    constructor(cupoTotal, numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
        this.cupoTotal = cupoTotal;
        this.cupoDisponible = cupoTotal;
        this.deudaActual = 0;
        this.movimientos = [];
    }

    comprarAcuotas(monto, cuotas) {
        if (monto <= 0) throw new Error("El monto de la compra debe ser mayor a cero.");
        if (monto > this.cupoDisponible) throw new Error("Cupo de crédito insuficiente para realizar la compra.");
        if (cuotas <= 0) throw new Error("El número de cuotas debe ser al menos 1.");

        let tasaMensual = 0;
        if (cuotas <= 2) {
            tasaMensual = 0;
        } else if (cuotas >= 3 && cuotas <= 6) {
            tasaMensual = 0.019;
        } else {
            tasaMensual = 0.023;
        }

        let cuotaMensual = 0;
        if (tasaMensual === 0) {
            cuotaMensual = monto / cuotas;
        } else {
            cuotaMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
        }

        this.cupoDisponible -= monto;
        this.deudaActual += (cuotaMensual * cuotas);

        const fechaHora = new Date().toLocaleString();
        this.movimientos.unshift({
            fechaHora,
            tipo: `Compra a ${cuotas} cuotas`,
            valor: monto,
            cuotaMensual: cuotaMensual.toFixed(2)
        });

        return cuotaMensual;
    }
}

//aca estaan losmdatos

let dbClientes = [];
let usuarioLogueado = null;

function inicializarSistema() {
    const clienteDemo = new CientePrueba("12345678", "Carlos Pérez", "3001234567", "carlos", "1234");
    dbClientes.push(clienteDemo);
}

function CientePrueba(id, nombre, celular, user, pass) {
    let c = new Cliente(id, nombre, celular, user, pass);
    return c;
}

inicializarSistema();

//aca esta el router y el ui
function router(view, params = {}) {
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    actualizarMenu();

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

function actualizarMenu() {
    const nav = document.getElementById('main-nav');
    if (usuarioLogueado) {
        nav.innerHTML = `
            <li><a onclick="router('dashboard')">Panel Principal</a></li>
            <li><a onclick="router('admin')">Gestión Usuarios (CRUD)</a></li>
            <li><a onclick="cerrarSesion()" style="color: var(--danger);">Cerrar Sesión</a></li>
        `;
    } else {
        nav.innerHTML = `
            <li><a onclick="router('landing')">Inicio</a></li>
            <li><a onclick="router('login')">Iniciar Sesión</a></li>
            <li><a onclick="router('register')">Registrarse</a></li>
        `;
    }
}

function cerrarSesion() {
    usuarioLogueado = null;
    router('landing');
}

function renderLanding() {
    return `
        <div class="card text-center" style="max-width: 600px;">
            <h1 style="color: var(--secondary); margin-bottom: 1rem;">Bienvenido a Mi Plata</h1>
            <p style="color: var(--dark); margin-bottom: 1.5rem; line-height: 1.6;">
                Tu banco digital confiable. Gestiona tus Cuentas de Ahorros, Cuentas Corrientes y Tarjetas de Crédito de forma rápida, segura y con las mejores tasas del mercado financiero.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="router('login')">Iniciar Sesión</button>
                <button class="secondary-btn" onclick="router('register')">Registrarse</button>
            </div>
        </div>
    `;
}

function renderLogin() {
    return `
        <div class="card">
            <h2>Iniciar Sesión</h2>
            <div id="login-alert"></div>
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Nombre de Usuario</label>
                    <input type="text" id="login-user" required placeholder="Ej. carlos">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="login-pass" required placeholder="••••">
                </div>
                <button type="submit">Ingresar</button>
            </form>
            <div class="text-center" style="margin-top: 1rem;">
                <p>¿No tienes cuenta? <a onclick="router('register')">Regístrate aquí</a></p>
            </div>
        </div>
    `;
}

function renderRegister() {
    return `
        <div class="card">
            <h2>Registro de Cliente</h2>
            <div id="reg-alert"></div>
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>Identificación (Cédula / Pasaporte)</label>
                    <input type="text" id="reg-id" required>
                </div>
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="reg-nombre" required>
                </div>
                <div class="form-group">
                    <label>Número de Celular</label>
                    <input type="tel" id="reg-cel" required>
                </div>
                <div class="form-group">
                    <label>Nombre de Usuario (Único)</label>
                    <input type="text" id="reg-user" required>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="reg-pass" required>
                </div>
                <button type="submit">Registrarse</button>
            </form>
            <div class="text-center" style="margin-top: 1rem;">
                <p>¿Ya tienes cuenta? <a onclick="router('login')">Inicia sesión</a></p>
            </div>
        </div>
    `;
}

function renderDashboard() {
    return `
        <div class="card wide">
            <h2>Panel de Transacciones - Mi Plata</h2>
            <p style="text-align: center; color: var(--gray); margin-bottom: 1.5rem;">Hola, <strong>${usuarioLogueado.nombreCompleto}</strong>. Selecciona una opción:</p>
            <div class="dashboard-grid">
                <div class="dashboard-card" onclick="router('saldo')">
                    <h3>Consultar Saldo</h3>
                    <p>Ver saldos de tus productos</p>
                </div>
                <div class="dashboard-card" onclick="router('consignar')">
                    <h3>Consignar Dinero</h3>
                    <p>Depósitos a tus cuentas</p>
                </div>
                <div class="dashboard-card" onclick="router('retirar')">
                    <h3>Retirar Dinero</h3>
                    <p>Retiros con reglas de producto</p>
                </div>
                <div class="dashboard-card" onclick="router('transferir')">
                    <h3>Transferencias</h3>
                    <p>Entre tus cuentas o a terceros</p>
                </div>
                <div class="dashboard-card" onclick="router('tarjeta')">
                    <h3>Tarjeta de Crédito</h3>
                    <p>Compras a cuotas con interés</p>
                </div>
                <div class="dashboard-card" onclick="router('movimientos')">
                    <h3>Ver Movimientos</h3>
                    <p>Historial detallado</p>
                </div>
                <div class="dashboard-card" onclick="router('perfil')">
                    <h3>Perfil y Seguridad</h3>
                    <p>Editar datos y clave</p>
                </div>
                <div class="dashboard-card" onclick="router('admin')">
                    <h3>Gestión de Usuarios</h3>
                    <p>CRUD de Clientes</p>
                </div>
            </div>
        </div>
    `;
}

function renderSaldo() {
    return `
        <div class="card wide">
            <h2>Consulta de Saldos</h2>
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Número / Identificador</th>
                    <th>Saldo / Cupo Disponible</th>
                </tr>
                <tr>
                    <td>Cuenta de Ahorros</td>
                    <td>${usuarioLogueado.cuentaAhorros.numeroCuenta}</td>
                    <td>$${usuarioLogueado.cuentaAhorros.saldo.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Cuenta Corriente</td>
                    <td>${usuarioLogueado.cuentaCorriente.numeroCuenta}</td>
                    <td>$${usuarioLogueado.cuentaCorriente.saldo.toFixed(2)} (Sobregiro 20% disp.)</td>
                </tr>
                <tr>
                    <td>Tarjeta de Crédito</td>
                    <td>${usuarioLogueado.tarjetaCredito.numeroCuenta}</td>
                    <td>Cupo Disponible: $${usuarioLogueado.tarjetaCredito.cupoDisponible.toFixed(2)} / Deuda: $${usuarioLogueado.tarjetaCredito.deudaActual.toFixed(2)}</td>
                </tr>
            </table>
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="router('dashboard')">Volver al Panel</button>
        </div>
    `;
}

function renderConsignar() {
    return `
        <div class="card">
            <h2>Consignar Dinero</h2>
            <div id="consignar-alert"></div>
            <form onsubmit="handleConsignar(event)">
                <div class="form-group">
                    <label>Seleccionar Producto</label>
                    <select id="consignar-producto">
                        <option value="ahorros">Cuenta de Ahorros (${usuarioLogueado.cuentaAhorros.numeroCuenta})</option>
                        <option value="corriente">Cuenta Corriente (${usuarioLogueado.cuentaCorriente.numeroCuenta})</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Monto a Consignar ($)</label>
                    <input type="number" id="consignar-monto" min="1" step="any" required>
                </div>
                <button type="submit">Realizar Consignación</button>
            </form>
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="router('dashboard')">Volver</button>
        </div>
    `;
}

function renderRetirar() {
    return `
        <div class="card">
            <h2>Retirar Dinero</h2>
            <div id="retirar-alert"></div>
            <form onsubmit="handleRetirar(event)">
                <div class="form-group">
                    <label>Seleccionar Producto</label>
                    <select id="retirar-producto">
                        <option value="ahorros">Cuenta de Ahorros (Aplica 1.5% interés al retirar)</option>
                        <option value="corriente">Cuenta Corriente (Permite hasta 20% sobregiro)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Monto a Retirar ($)</label>
                    <input type="number" id="retirar-monto" min="1" step="any" required>
                </div>
                <button type="submit">Realizar Retiro</button>
            </form>
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="router('dashboard')">Volver</button>
        </div>
    `;
}

function renderTransferir() {
    return `
        <div class="card">
            <h2>Transferencias</h2>
            <div id="transfer-alert"></div>
            <form onsubmit="handleTransfer(event)">
                <div class="form-group">
                    <label>Origen</label>
                    <select id="trans-origen">
                        <option value="ahorros">Cuenta de Ahorros</option>
                        <option value="corriente">Cuenta Corriente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Destino (Usuario o Cuenta)</label>
                    <select id="trans-tipo-destino" onchange="toggleDestinoInput(this.value)">
                        <option value="propia">Mi otro producto</option>
                        <option value="tercero">A otro usuario (por Username)</option>
                    </select>
                </div>
                <div class="form-group" id="group-destino-propio">
                    <label>Producto Destino Propio</label>
                    <select id="trans-destino-propio">
                        <option value="corriente">Cuenta Corriente</option>
                        <option value="ahorros">Cuenta de Ahorros</option>
                    </select>
                </div>
                <div class="form-group hidden" id="group-destino-tercero">
                    <label>Username del Tercero</label>
                    <input type="text" id="trans-username-tercero" placeholder="Usuario destino">
                    <label style="margin-top: 0.5rem;">Tipo Cuenta Destino</label>
                    <select id="trans-cuenta-tercero">
                        <option value="ahorros">Cuenta de Ahorros</option>
                        <option value="corriente">Cuenta Corriente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Monto a Transferir ($)</label>
                    <input type="number" id="trans-monto" min="1" step="any" required>
                </div>
                <button type="submit">Transferir</button>
            </form>
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="router('dashboard')">Volver</button>
        </div>
    `;
}

function toggleDestinoInput(val) {
    if (val === 'propia') {
        document.getElementById('group-destino-propio').classList.remove('hidden');
        document.getElementById('group-destino-tercero').classList.add('hidden');
    } else {
        document.getElementById('group-destino-propio').classList.add('hidden');
        document.getElementById('group-destino-tercero').classList.remove('hidden');
    }
}

function renderTarjeta() {
    return `
        <div class="card">
            <h2>Tarjeta de Crédito - Compras</h2>
            <div id="tc-alert"></div>
            <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1rem;">
                Cupo Total: $${usuarioLogueado.tarjetaCredito.cupoTotal.toFixed(2)} | Disponible: $${usuarioLogueado.tarjetaCredito.cupoDisponible.toFixed(2)}
            </p>
            <form onsubmit="handleTarjetaCompra(event)">
                <div class="form-group">
                    <label>Monto de la Compra ($)</label>
                    <input type="number" id="tc-monto" min="1" step="any" required>
                </div>
                <div class="form-group">
                    <label>Número de Cuotas</label>
                    <input type="number" id="tc-cuotas" min="1" max="36" required placeholder="1 a 36 cuotas">
                    <small style="color: var(--gray); display:block; margin-top:3px;">≤2 cuotas: 0% | 3-6 cuotas: 1.9% | ≥7 cuotas: 2.3% mensual</small>
                </div>
                <button type="submit">Procesar Compra</button>
            </form>
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="router('dashboard')">Volver</button>
        </div>
    `;
}

function renderMovimientos() {
    let htmlMovs = '';
    const todosMovs = [
        ...usuarioLogueado.cuentaAhorros.movimientos.map(m => ({...m, prod: 'Ahorros'})),
        ...usuarioLogueado.cuentaCorriente.movimientos.map(m => ({...m, prod: 'Corriente'})),
        ...usuarioLogueado.tarjetaCredito.movimientos.map(m => ({fechaHora: m.fechaHora, tipo: m.tipo, valor: m.valor, prod: 'Tarjeta Crédito', cuotaMensual: m.cuotaMensual}))
    ];

    if (todosMovs.length === 0) {
        htmlMovs = '<tr><td colspan="4" class="text-center">No hay movimientos registrados.</td></tr>';
    } else {
        htmlMovs = todosMovs.map(m => `
            <tr>
                <td>${m.fechaHora}</td>
                <td>${m.prod}</td>
                <td>${m.tipo}</td>
                <td>$${m.valor.toFixed(2)} ${m.cuotaMensual ? `<br><small>Cuota: $${m.cuotaMensual}</small>` : ''}</td>
            </tr>
        `).join('');
    }

    return `
        <div class="card wide">
            <h2>Historial de Movimientos</h2>
            <table>
                <tr>
                    <th>Fecha y Hora</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Valor / Detalle</th>
                </tr>
                ${htmlMovs}
            </table>
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="router('dashboard')">Volver al Panel</button>
        </div>
    `;
}

function renderPerfil() {
    return `
        <div class="card">
            <h2>Perfil y Seguridad</h2>
            <div id="perfil-alert"></div>
            <form onsubmit="handleUpdatePerfil(event)">
                <h3 style="font-size: 1rem; color: var(--dark); margin-bottom: 0.5rem;">Actualizar Datos</h3>
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="perfil-nombre" value="${usuarioLogueado.nombreCompleto}" required>
                </div>
                <div class="form-group">
                    <label>Celular</label>
                    <input type="tel" id="perfil-cel" value="${usuarioLogueado.celular}" required>
                </div>
                <button type="submit">Guardar Cambios de Perfil</button>
            </form>

            <hr style="margin: 1.5rem 0; border:0; border-top:1px solid #e2e8f0;">

            <form onsubmit="handleChangePassword(event)">
                <h3 style="font-size: 1rem; color: var(--dark); margin-bottom: 0.5rem;">Cambiar Contraseña</h3>
                <div class="form-group">
                    <label>Contraseña Actual</label>
                    <input type="password" id="pass-actual" required>
                </div>
                <div class="form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" id="pass-nueva" required>
                </div>
                <div class="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input type="password" id="pass-confirmar" required>
                </div>
                <button type="submit" class="secondary-btn">Actualizar Contraseña</button>
            </form>
            <button class="danger" style="margin-top: 1rem;" onclick="router('dashboard')">Volver</button>
        </div>
    `;
}

function renderAdmin() {
    let filas = dbClientes.map(c => `
        <tr>
            <td>${c.identificacion}</td>
            <td>${c.nombreCompleto}</td>
            <td>${c.username}</td>
            <td>${c.bloqueado ? '<span style="color:red">Bloqueado</span>' : '<span style="color:green">Activo</span>'}</td>
            <td>
                <button onclick="editarClientePrompt('${c.username}')" style="padding: 4px 8px; font-size:0.8rem;">Editar</button>
                <button onclick="eliminarCliente('${c.username}')" class="danger" style="padding: 4px 8px; font-size:0.8rem; margin-top:2px;">Eliminar</button>
            </td>
        </tr>
    `).join('');

    return `
        <div class="card wide">
            <h2>Administración de Usuarios (CRUD)</h2>
            <table>
                <tr>
                    <th>Identificación</th>
                    <th>Nombre</th>
                    <th>Username</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                ${filas}
            </table>
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="router('dashboard')">Volver al Panel</button>
        </div>
    `;
}

/* ==========================================
   5. CONTROLADORES DE EVENTOS Y ACCIONES
   ========================================== */
function handleLogin(e) {
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
        usuarioLogueado = cliente;
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

function handleRegister(e) {
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

function handleConsignar(e) {
    e.preventDefault();
    const prod = document.getElementById('consignar-producto').value;
    const monto = parseFloat(document.getElementById('consignar-monto').value);
    const alertDiv = document.getElementById('consignar-alert');

    try {
        let cuenta = prod === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
        cuenta.consignar(monto);
        alertDiv.innerHTML = `<div class="alert alert-success">Consignación exitosa. Nuevo saldo: $${cuenta.saldo.toFixed(2)}</div>`;
        document.getElementById('consignar-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

function handleRetirar(e) {
    e.preventDefault();
    const prod = document.getElementById('retirar-producto').value;
    const monto = parseFloat(document.getElementById('retirar-monto').value);
    const alertDiv = document.getElementById('retirar-alert');

    try {
        let cuenta = prod === 'ahorros' ? usuarioLogueado.cuentaAhorros : usuarioLogueado.cuentaCorriente;
        cuenta.retirar(monto);
        alertDiv.innerHTML = `<div class="alert alert-success">Retiro exitoso. Nuevo saldo: $${cuenta.saldo.toFixed(2)}</div>`;
        document.getElementById('retirar-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

function handleTransfer(e) {
    e.preventDefault();
    const origenKey = document.getElementById('trans-origen').value;
    const tipoDestino = document.getElementById('trans-tipo-destino').value;
    const monto = parseFloat(document.getElementById('trans-monto').value);
    const alertDiv = document.getElementById('transfer-alert');

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
        if (origenKey === 'ahorros') {
            cuentaOrigen.retirar(monto);
        } else {
            cuentaOrigen.retirar(monto);
        }
        cuentaDestino.consignar(monto);
        cuentaOrigen.movimientos[0].tipo = "Transferencia Enviada";
        cuentaDestino.movimientos[0].tipo = "Transferencia Recibida";

        alertDiv.innerHTML = `<div class="alert alert-success">¡Transferencia realizada con éxito!</div>`;
        document.getElementById('trans-monto').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

function handleTarjetaCompra(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('tc-monto').value);
    const cuotas = parseInt(document.getElementById('tc-cuotas').value);
    const alertDiv = document.getElementById('tc-alert');

    try {
        const cuotaMensual = usuarioLogueado.tarjetaCredito.comprarAcuotas(monto, cuotas);
        alertDiv.innerHTML = `<div class="alert alert-success">Compra exitosa a ${cuotas} cuotas. Valor cuota mensual: $${cuotaMensual.toFixed(2)}</div>`;
        document.getElementById('tc-monto').value = '';
        document.getElementById('tc-cuotas').value = '';
    } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
}

function handleUpdatePerfil(e) {
    e.preventDefault();
    usuarioLogueado.nombreCompleto = document.getElementById('perfil-nombre').value.trim();
    usuarioLogueado.celular = document.getElementById('perfil-cel').value.trim();
    document.getElementById('perfil-alert').innerHTML = `<div class="alert alert-success">Perfil actualizado correctamente.</div>`;
}

function handleChangePassword(e) {
    e.preventDefault();
    const actual = document.getElementById('pass-actual').value;
    const nueva = document.getElementById('pass-nueva').value;
    const confirmar = document.getElementById('pass-confirmar').value;
    const alertDiv = document.getElementById('perfil-alert');

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

function editarClientePrompt(username) {
    const cliente = dbClientes.find(c => c.username === username);
    if (!cliente) return;
    const nuevoNombre = prompt("Nuevo nombre completo:", cliente.nombreCompleto);
    const nuevoCel = prompt("Nuevo celular:", cliente.celular);
    if (nuevoNombre) cliente.nombreCompleto = nuevoNombre;
    if (nuevoCel) cliente.celular = nuevoCel;
    router('admin');
}

function eliminarCliente(username) {
    if (usuarioLogueado && usuarioLogueado.username === username) {
        alert("No puedes eliminar tu propia cuenta activa.");
        return;
    }
    if (confirm(`¿Estás seguro de eliminar al usuario ${username}?`)) {
        dbClientes = dbClientes.filter(c => c.username !== username);
        router('admin');
    }
}

router('landing');