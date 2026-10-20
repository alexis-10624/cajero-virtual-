import { router, cerrarSesion, toggleDestinoInput, handleLogin, handleRegister, handleConsignar, handleRetirar, handleTransfer, handleTarjetaCompra, handleUpdatePerfil, handleChangePassword, editarClientePrompt, eliminarCliente } from './controllers/controllers.js';

// Exponer funciones necesarias al objeto global window para que el HTML pueda invocarlas
window.router = router;
window.cerrarSesion = cerrarSesion;
window.toggleDestinoInput = toggleDestinoInput;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleConsignar = handleConsignar;
window.handleRetirar = handleRetirar;
window.handleTransfer = handleTransfer;
window.handleTarjetaCompra = handleTarjetaCompra;
window.handleUpdatePerfil = handleUpdatePerfil;
window.handleChangePassword = handleChangePassword;
window.editarClientePrompt = editarClientePrompt;
window.eliminarCliente = eliminarCliente;


router('landing');