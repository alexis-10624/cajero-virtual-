import { Cliente } from '../models/Cliente.js';

export let dbClientes = [];
export let usuarioLogueado = null;

export function setUsuarioLogueado(nuevoUsuario) {
    usuarioLogueado = nuevoUsuario;
}

export function getUsuarioLogueado() {
    return usuarioLogueado;
}

function CientePrueba(id, nombre, celular, user, pass) {
    let c = new Cliente(id, nombre, celular, user, pass);
    return c;
}

function inicializarSistema() {
    const clienteDemo = CientePrueba("12345678", "Carlos Pérez", "3001234567", "carlos", "1234");
    dbClientes.push(clienteDemo);
}

inicializarSistema();