import { getUsuarioLogueado, dbClientes } from '../data/database.js';

export function actualizarMenu(router) {
    const nav = document.getElementById('main-nav');
    const usuarioLogueado = getUsuarioLogueado();
    if (usuarioLogueado) {
        nav.innerHTML = `
            <li><a onclick="window.router('dashboard')">Panel Principal</a></li>
            <li><a onclick="window.router('admin')">Gestión Usuarios (CRUD)</a></li>
            <li><a onclick="window.cerrarSesion()" style="color: var(--danger);">Cerrar Sesión</a></li>
        `;
    } else {
        nav.innerHTML = `
            <li><a onclick="window.router('landing')">Inicio</a></li>
            <li><a onclick="window.router('login')">Iniciar Sesión</a></li>
            <li><a onclick="window.router('register')">Registrarse</a></li>
        `;
    }
}

export function renderLanding() {
    return `
        <div class="card text-center" style="max-width: 600px;">
            <h1 style="color: var(--secondary); margin-bottom: 1rem;">Bienvenido a Mi Plata</h1>
            <p style="color: var(--dark); margin-bottom: 1.5rem; line-height: 1.6;">
                Tu banco digital confiable. Gestiona tus Cuentas de Ahorros, Cuentas Corrientes y Tarjetas de Crédito de forma rápida, segura y con las mejores tasas del mercado financiero.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.router('login')">Iniciar Sesión</button>
                <button class="secondary-btn" onclick="window.router('register')">Registrarse</button>
            </div>
        </div>
    `;
}

export function renderLogin() {
    return `
        <div class="card">
            <h2>Iniciar Sesión</h2>
            <div id="login-alert"></div>
            <form onsubmit="window.handleLogin(event)">
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
                <p>¿No tienes cuenta? <a onclick="window.router('register')">Regístrate aquí</a></p>
            </div>
        </div>
    `;
}

export function renderRegister() {
    return `
        <div class="card">
            <h2>Registro de Cliente</h2>
            <div id="reg-alert"></div>
            <form onsubmit="window.handleRegister(event)">
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
                <p>¿Ya tienes cuenta? <a onclick="window.router('login')">Inicia sesión</a></p>
            </div>
        </div>
    `;
}

export function renderDashboard() {
    const usuarioLogueado = getUsuarioLogueado();
    return `
        <div class="card wide">
            <h2>Panel de Transacciones - Mi Plata</h2>
            <p style="text-align: center; color: var(--gray); margin-bottom: 1.5rem;">Hola, <strong>${usuarioLogueado.nombreCompleto}</strong>. Selecciona una opción:</p>
            <div class="dashboard-grid">
                <div class="dashboard-card" onclick="window.router('saldo')">
                    <h3>Consultar Saldo</h3>
                    <p>Ver saldos de tus productos</p>
                </div>
                <div class="dashboard-card" onclick="window.router('consignar')">
                    <h3>Consignar Dinero</h3>
                    <p>Depósitos a tus cuentas</p>
                </div>
                <div class="dashboard-card" onclick="window.router('retirar')">
                    <h3>Retirar Dinero</h3>
                    <p>Retiros con reglas de producto</p>
                </div>
                <div class="dashboard-card" onclick="window.router('transferir')">
                    <h3>Transferencias</h3>
                    <p>Entre tus cuentas o a terceros</p>
                </div>
                <div class="dashboard-card" onclick="window.router('tarjeta')">
                    <h3>Tarjeta de Crédito</h3>
                    <p>Compras a cuotas con interés</p>
                </div>
                <div class="dashboard-card" onclick="window.router('movimientos')">
                    <h3>Ver Movimientos</h3>
                    <p>Historial detallado</p>
                </div>
                <div class="dashboard-card" onclick="window.router('perfil')">
                    <h3>Perfil y Seguridad</h3>
                    <p>Editar datos y clave</p>
                </div>
                <div class="dashboard-card" onclick="window.router('admin')">
                    <h3>Gestión de Usuarios</h3>
                    <p>CRUD de Clientes</p>
                </div>
            </div>
        </div>
    `;
}

export function renderSaldo() {
    const usuarioLogueado = getUsuarioLogueado();
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
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="window.router('dashboard')">Volver al Panel</button>
        </div>
    `;
}

export function renderConsignar() {
    const usuarioLogueado = getUsuarioLogueado();
    return `
        <div class="card">
            <h2>Consignar Dinero</h2>
            <div id="consignar-alert"></div>
            <form onsubmit="window.handleConsignar(event)">
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
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="window.router('dashboard')">Volver</button>
        </div>
    `;
}

export function renderRetirar() {
    return `
        <div class="card">
            <h2>Retirar Dinero</h2>
            <div id="retirar-alert"></div>
            <form onsubmit="window.handleRetirar(event)">
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
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="window.router('dashboard')">Volver</button>
        </div>
    `;
}

export function renderTransferir() {
    return `
        <div class="card">
            <h2>Transferencias</h2>
            <div id="transfer-alert"></div>
            <form onsubmit="window.handleTransfer(event)">
                <div class="form-group">
                    <label>Origen</label>
                    <select id="trans-origen">
                        <option value="ahorros">Cuenta de Ahorros</option>
                        <option value="corriente">Cuenta Corriente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Destino (Usuario o Cuenta)</label>
                    <select id="trans-tipo-destino" onchange="window.toggleDestinoInput(this.value)">
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
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="window.router('dashboard')">Volver</button>
        </div>
    `;
}

export function renderTarjeta() {
    const usuarioLogueado = getUsuarioLogueado();
    return `
        <div class="card">
            <h2>Tarjeta de Crédito - Compras</h2>
            <div id="tc-alert"></div>
            <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1rem;">
                Cupo Total: $${usuarioLogueado.tarjetaCredito.cupoTotal.toFixed(2)} | Disponible: $${usuarioLogueado.tarjetaCredito.cupoDisponible.toFixed(2)}
            </p>
            <form onsubmit="window.handleTarjetaCompra(event)">
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
            <button class="secondary-btn" style="margin-top: 1rem;" onclick="window.router('dashboard')">Volver</button>
        </div>
    `;
}

export function renderMovimientos() {
    const usuarioLogueado = getUsuarioLogueado();
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
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="window.router('dashboard')">Volver al Panel</button>
        </div>
    `;
}

export function renderPerfil() {
    const usuarioLogueado = getUsuarioLogueado();
    return `
        <div class="card">
            <h2>Perfil y Seguridad</h2>
            <div id="perfil-alert"></div>
            <form onsubmit="window.handleUpdatePerfil(event)">
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

            <form onsubmit="window.handleChangePassword(event)">
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
            <button class="danger" style="margin-top: 1rem;" onclick="window.router('dashboard')">Volver</button>
        </div>
    `;
}

export function renderAdmin() {
    let filas = dbClientes.map(c => `
        <tr>
            <td>${c.identificacion}</td>
            <td>${c.nombreCompleto}</td>
            <td>${c.username}</td>
            <td>${c.bloqueado ? '<span style="color:red">Bloqueado</span>' : '<span style="color:green">Activo</span>'}</td>
            <td>
                <button onclick="window.editarClientePrompt('${c.username}')" style="padding: 4px 8px; font-size:0.8rem;">Editar</button>
                <button onclick="window.eliminarCliente('${c.username}')" class="danger" style="padding: 4px 8px; font-size:0.8rem; margin-top:2px;">Eliminar</button>
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
            <button class="secondary-btn" style="margin-top: 1.5rem;" onclick="window.router('dashboard')">Volver al Panel</button>
        </div>
    `;
}