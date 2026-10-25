// ===================================
// 1. CAMBIAR LA APARIENCIA
// ===================================

const botonTema = document.getElementById("botonTema");

if (botonTema) {

    botonTema.addEventListener("click", function () {

        document.body.classList.toggle("modo-oscuro");

        if (document.body.classList.contains("modo-oscuro")) {
            botonTema.textContent = "☀️ Cambiar a modo claro";
        } else {
            botonTema.textContent = "🌙 Cambiar apariencia";
        }

    });

}


// ===================================
// 2. MOSTRAR Y OCULTAR INFORMACIÓN
// ===================================

const botonHistoria = document.getElementById("botonHistoria");
const historiaExtra = document.getElementById("historiaExtra");

if (botonHistoria && historiaExtra) {

    botonHistoria.addEventListener("click", function () {

        historiaExtra.classList.toggle("visible");

        if (historiaExtra.classList.contains("visible")) {
            botonHistoria.textContent = "Ocultar información";
        } else {
            botonHistoria.textContent = "Leer información adicional";
        }

    });

}


// ===================================
// 3. MOSTRAR CURIOSIDADES DE ITACE
// ===================================

const botonCuriosidad = document.getElementById("botonCuriosidad");
const datoCurioso = document.getElementById("datoCurioso");

const curiosidades = [

    "ITACE significa Instituto Tamaulipeco de Capacitación para el Empleo.",

    "La programación permite crear páginas web, aplicaciones y soluciones digitales.",

    "La ciberseguridad ayuda a proteger la información y los sistemas digitales.",

    "El diseño gráfico digital combina imágenes, colores y tipografía para comunicar ideas.",

    "La logística ayuda a organizar el almacenamiento y el transporte de productos.",

    "El mantenimiento industrial permite conservar los equipos en buenas condiciones.",

    "El mantenimiento automotriz se enfoca en revisar y conservar los vehículos.",

    "Los semiconductores son fundamentales para fabricar muchos dispositivos electrónicos.",

    "La inteligencia artificial permite desarrollar sistemas capaces de realizar tareas que requieren capacidades humanas.",

    "Aprender habilidades técnicas puede ayudar a prepararse para diferentes oportunidades laborales."

];

let indiceCuriosidad = -1;

if (botonCuriosidad && datoCurioso) {

    botonCuriosidad.addEventListener("click", function () {

        let nuevoIndice;

        do {

            nuevoIndice = Math.floor(
                Math.random() * curiosidades.length
            );

        } while (
            curiosidades.length > 1 &&
            nuevoIndice === indiceCuriosidad
        );

        indiceCuriosidad = nuevoIndice;

        datoCurioso.textContent = curiosidades[indiceCuriosidad];

    });

}


// ===================================
// 4. BOTÓN PARA VOLVER ARRIBA
// ===================================

const botonArriba = document.getElementById("volverArriba");

if (botonArriba) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 400) {
            botonArriba.classList.add("visible");
        } else {
            botonArriba.classList.remove("visible");
        }

    });

    botonArriba.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ===================================
// 5. MARCAR LA SECCIÓN ACTUAL DEL MENÚ
// ===================================

const enlacesMenu = document.querySelectorAll(".menu a");

const secciones = document.querySelectorAll(
    "main section[id], header[id], footer[id]"
);

function actualizarMenu() {

    let seccionActual = "";

    secciones.forEach(function (seccion) {

        const posicion = seccion.getBoundingClientRect();

        if (
            posicion.top <= 160 &&
            posicion.bottom > 160
        ) {
            seccionActual = seccion.id;
        }

    });

    enlacesMenu.forEach(function (enlace) {

        enlace.classList.remove("activo");

        if (
            seccionActual &&
            enlace.getAttribute("href") === "#" + seccionActual
        ) {
            enlace.classList.add("activo");
        }

    });

}

window.addEventListener("scroll", actualizarMenu);

actualizarMenu();


// ===================================
// 6. ANIMACIÓN DE LAS TARJETAS
// ===================================

const elementosAnimados = document.querySelectorAll(
    ".tarjeta, .fotos figure, .gif-tarjeta, .dato-curioso"
);

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver(
        function (entradas) {

            entradas.forEach(function (entrada) {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("aparecio");

                    observador.unobserve(entrada.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    elementosAnimados.forEach(function (elemento) {

        observador.observe(elemento);

    });

}


// ===================================
// 7. ANIMACIÓN AL APARECER
// ===================================

const estiloAnimacion = document.createElement("style");

estiloAnimacion.textContent = `

    .tarjeta,
    .fotos figure,
    .gif-tarjeta,
    .dato-curioso {
        opacity: 0;
        transform: translateY(20px);
        transition:
            opacity 0.6s ease,
            transform 0.6s ease;
    }

    .tarjeta.aparecio,
    .fotos figure.aparecio,
    .gif-tarjeta.aparecio,
    .dato-curioso.aparecio {
        opacity: 1;
        transform: translateY(0);
    }

`;

document.head.appendChild(estiloAnimacion);