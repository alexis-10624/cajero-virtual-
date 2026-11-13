export class TarjetaCredito {
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