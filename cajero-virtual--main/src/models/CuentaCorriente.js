import { Cuenta } from './Cuenta.js';

export class CuentaCorriente extends Cuenta {
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