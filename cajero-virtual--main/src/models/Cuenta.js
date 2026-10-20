export class Cuenta {
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