import { CuentaAhorros } from './CuentaAhorros.js';
import { CuentaCorriente } from './CuentaCorriente.js';
import { TarjetaCredito } from './TarjetaCredito.js';

export class Cliente {
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