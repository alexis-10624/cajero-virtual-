import { Cuenta } from './Cuenta.js';

export class CuentaAhorros extends Cuenta {
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