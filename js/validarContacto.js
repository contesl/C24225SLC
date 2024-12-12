document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contacto');

    form.addEventListener('submit', (event) => {
        // Evitar el envío predeterminado para validar los campos
        event.preventDefault();

        // Obtener los campos del formulario
        const nombre = document.getElementById('contactoNombre');
        const email = document.getElementById('contactoEmail');
        const pais = document.getElementById('contactoPais');
        const mensaje = document.getElementById('contactoMensaje');

        // Validar que los campos no estén vacíos
        if (nombre.value.trim() === '') {
            alert('Por favor, completa el campo Nombre y Apellidos.');
            nombre.focus();
            return;
        }

        if (email.value.trim() === '') {
            alert('Por favor, completa el campo Email.');
            email.focus();
            return;
        }

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            email.focus();
            return;
        }

        if (pais.value === '0') {
            alert('Por favor, selecciona un país.');
            pais.focus();
            return;
        }

        if (mensaje.value.trim() === '' || mensaje.value.trim() === 'Escribe aquí tu mensaje...') {
            alert('Por favor, escribe un mensaje.');
            mensaje.focus();
            return;
        }

        // Si las validaciones son correctas, envía el formulario al action
        alert('Formulario enviado exitosamente.');
        form.submit(); // Enviar al action
    });
});

