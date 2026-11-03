document.addEventListener("DOMContentLoaded", () => {

    // Modo oscuro

    const botonTema = document.getElementById("botonTema");

    function actualizarTema() {
        const oscuro = document.body.classList.contains("modo-oscuro");

        if (botonTema) {
            botonTema.textContent = oscuro
                ? "☀️ Modo claro"
                : "🌙 Modo oscuro";
        }
    }

    if (localStorage.getItem("temaITACE") === "oscuro") {
        document.body.classList.add("modo-oscuro");
    }

    actualizarTema();

    if (botonTema) {
        botonTema.addEventListener("click", () => {
            document.body.classList.toggle("modo-oscuro");

            const tema = document.body.classList.contains("modo-oscuro")
                ? "oscuro"
                : "claro";

            localStorage.setItem("temaITACE", tema);
            actualizarTema();
        });
    }

    // Menú móvil

    const botonMenu = document.getElementById("botonMenu");
    const menu = document.getElementById("menu");

    if (botonMenu && menu) {
        botonMenu.addEventListener("click", () => {
            const abierto = menu.classList.toggle("menu-abierto");

            botonMenu.setAttribute("aria-expanded", String(abierto));
        });

        menu.querySelectorAll("a").forEach(enlace => {
            enlace.addEventListener("click", () => {
                menu.classList.remove("menu-abierto");
                botonMenu.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Historia desplegable

    const botonHistoria = document.getElementById("botonHistoria");
    const ventanaHistoria = document.getElementById("ventanaHistoria");

    if (botonHistoria && ventanaHistoria) {
        botonHistoria.addEventListener("click", () => {
            const abrir = ventanaHistoria.hidden;

            ventanaHistoria.hidden = !abrir;

            botonHistoria.textContent = abrir
                ? "Leer menos ▲"
                : "Conocer más ▼";

            botonHistoria.setAttribute("aria-expanded", String(abrir));
        });
    }

    // Curiosidades

    const curiosidades = [
        "La programación combina lógica, creatividad y solución de problemas.",
        "Los proyectos permiten aplicar los conocimientos aprendidos en clase.",
        "El trabajo en equipo ayuda a desarrollar habilidades de comunicación.",
        "La tecnología puede utilizarse para resolver problemas cotidianos.",
        "Las actividades culturales complementan la formación académica."
    ];

    const botonCuriosidad = document.getElementById("botonCuriosidad");
    const textoCuriosidad = document.getElementById("textoCuriosidad");

    if (botonCuriosidad && textoCuriosidad) {
        botonCuriosidad.addEventListener("click", () => {
            let nueva;

            do {
                nueva = curiosidades[
                    Math.floor(Math.random() * curiosidades.length)
                ];
            } while (
                nueva === textoCuriosidad.textContent &&
                curiosidades.length > 1
            );

            textoCuriosidad.textContent = nueva;
        });
    }

    // Carruseles 3D

    function crearCarrusel({
        pistaId,
        tarjetaSelector,
        anteriorId,
        siguienteId,
        indicadoresId
    }) {
        const pista = document.getElementById(pistaId);
        const botonAnterior = document.getElementById(anteriorId);
        const botonSiguiente = document.getElementById(siguienteId);
        const indicadores = document.getElementById(indicadoresId);

        if (!pista) return null;

        let posicion = 0;

        function tarjetasVisibles() {
            return Array.from(pista.querySelectorAll(tarjetaSelector))
                .filter(tarjeta => !tarjeta.hidden);
        }

        function mostrar() {
            const tarjetas = tarjetasVisibles();

            if (!tarjetas.length) {
                if (indicadores) indicadores.replaceChildren();
                return;
            }

            posicion = ((posicion % tarjetas.length) + tarjetas.length)
                % tarjetas.length;

            tarjetas.forEach((tarjeta, indice) => {
                tarjeta.classList.remove(
                    "activa",
                    "lado-izquierdo",
                    "lado-derecho",
                    "fuera-escena"
                );

                if (tarjetas.length === 1) {
                    tarjeta.classList.add("activa");
                } else if (indice === posicion) {
                    tarjeta.classList.add("activa");
                } else if (
                    indice === (posicion - 1 + tarjetas.length) % tarjetas.length
                ) {
                    tarjeta.classList.add("lado-izquierdo");
                } else if (
                    indice === (posicion + 1) % tarjetas.length
                ) {
                    tarjeta.classList.add("lado-derecho");
                } else {
                    tarjeta.classList.add("fuera-escena");
                }
            });

            if (indicadores) {
                indicadores.replaceChildren();

                tarjetas.forEach((tarjeta, indice) => {
                    const punto = document.createElement("button");

                    punto.type = "button";
                    punto.textContent = indice + 1;
                    punto.setAttribute(
                        "aria-label",
                        `Mostrar elemento ${indice + 1}`
                    );

                    if (indice === posicion) {
                        punto.classList.add("activo");
                        punto.setAttribute("aria-current", "true");
                    }

                    punto.addEventListener("click", () => {
                        posicion = indice;
                        mostrar();
                    });

                    indicadores.appendChild(punto);
                });
            }
        }

        function mover(direccion) {
            const tarjetas = tarjetasVisibles();

            if (!tarjetas.length) return;

            posicion = (
                posicion + direccion + tarjetas.length
            ) % tarjetas.length;

            mostrar();
        }

        if (botonAnterior) {
            botonAnterior.addEventListener("click", () => mover(-1));
        }

        if (botonSiguiente) {
            botonSiguiente.addEventListener("click", () => mover(1));
        }

        pista.addEventListener("click", evento => {
            const tarjeta = evento.target.closest(tarjetaSelector);

            if (!tarjeta) return;

            const tarjetas = tarjetasVisibles();
            const indice = tarjetas.indexOf(tarjeta);

            if (indice >= 0 && indice !== posicion) {
                posicion = indice;
                mostrar();
            }
        });

        mostrar();

        return {
            actualizar() {
                posicion = 0;
                mostrar();
            }
        };
    }

    // Carrusel de docentes

    const carruselDocentes = crearCarrusel({
        pistaId: "pistaDocentes",
        tarjetaSelector: ".tarjeta-docente",
        anteriorId: "docenteAnterior",
        siguienteId: "docenteSiguiente",
        indicadoresId: "indicadoresDocentes"
    });

    // Búsqueda de docentes

    const buscador = document.getElementById("buscarDocente");
    const pistaDocentes = document.getElementById("pistaDocentes");
    const mensajeVacio = document.getElementById("sinDocentes");

    if (buscador && pistaDocentes) {
        buscador.addEventListener("input", () => {
            const consulta = buscador.value
                .trim()
                .toLocaleLowerCase("es");

            const docentes = pistaDocentes.querySelectorAll(
                ".tarjeta-docente"
            );

            let encontrados = 0;

            docentes.forEach(docente => {
                const contenido = docente.textContent
                    .toLocaleLowerCase("es");

                const coincide = contenido.includes(consulta);

                docente.hidden = !coincide;

                if (coincide) encontrados++;
            });

            if (mensajeVacio) {
                mensajeVacio.hidden = encontrados !== 0;
            }

            if (carruselDocentes) {
                carruselDocentes.actualizar();
            }
        });
    }

    // Carrusel de galería

    crearCarrusel({
        pistaId: "pistaGaleria",
        tarjetaSelector: ".tarjeta-galeria",
        anteriorId: "galeriaAnterior",
        siguienteId: "galeriaSiguiente",
        indicadoresId: "indicadoresGaleria"
    });

    // Preguntas frecuentes

    document.querySelectorAll(".pregunta-faq").forEach(pregunta => {
        pregunta.addEventListener("click", () => {
            const respuesta = pregunta.nextElementSibling;

            if (!respuesta) return;

            const abrir = respuesta.hidden;

            respuesta.hidden = !abrir;
            pregunta.setAttribute("aria-expanded", String(abrir));

            const simbolo = pregunta.querySelector("span");

            if (simbolo) {
                simbolo.textContent = abrir ? "−" : "＋";
            }
        });
    });

    // Botón para volver arriba

    const botonArriba = document.getElementById("botonArriba");

    function revisarScroll() {
        if (botonArriba) {
            botonArriba.classList.toggle(
                "mostrar",
                window.scrollY > 350
            );
        }
    }

    window.addEventListener("scroll", revisarScroll);
    revisarScroll();

    if (botonArriba) {
        botonArriba.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Año actual

    document.querySelectorAll(".anio-actual").forEach(elemento => {
        elemento.textContent = new Date().getFullYear();
    });

});

// ANUNCIOS DE LOS CURSOS

const modalAnuncio = document.getElementById("modalAnuncio");
const tituloAnuncio = document.getElementById("tituloAnuncio");
const imagenAnuncio = document.getElementById("imagenAnuncio");
const cerrarAnuncio = document.getElementById("cerrarAnuncio");

document.querySelectorAll(".boton-anuncio").forEach(boton => {
    boton.addEventListener("click", () => {
        tituloAnuncio.textContent = boton.dataset.titulo;
        imagenAnuncio.src = boton.dataset.imagen;
        imagenAnuncio.alt = "Anuncio de " + boton.dataset.titulo;

        modalAnuncio.classList.add("abierto");
        modalAnuncio.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });
});

function ocultarAnuncio() {
    modalAnuncio.classList.remove("abierto");
    modalAnuncio.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

cerrarAnuncio.addEventListener("click", ocultarAnuncio);

modalAnuncio.addEventListener("click", evento => {
    if (evento.target === modalAnuncio) {
        ocultarAnuncio();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        ocultarAnuncio();
    }
});

// FILTROS DE EVENTOS

const filtrosEventos = document.querySelectorAll(".filtro-evento");
const tarjetasEventos = document.querySelectorAll(".tarjeta-evento");

filtrosEventos.forEach(boton => {
    boton.addEventListener("click", () => {
        filtrosEventos.forEach(filtro =>
            filtro.classList.remove("activo")
        );

        boton.classList.add("activo");

        const categoria = boton.dataset.categoria;

        tarjetasEventos.forEach(tarjeta => {
            const coincide =
                categoria === "todos" ||
                tarjeta.dataset.categoria === categoria;

            tarjeta.style.display = coincide ? "" : "none";
        });
    });
});


// FOTOGRAFÍAS DE CADA EVENTO
// Cambia los nombres por los de tus imágenes reales.

const galeriasEventos = {
    competencia: {
        titulo: "Competencia de los 4 ITACE",
        descripcion: "Recuerdos de las competencias estudiantiles.",
        fotos: [
            "imagenes/eventos/competencia_itace.jpg"
        ]
    },

    cancer: {
        titulo: "Concientización sobre el cáncer de mama",
        descripcion: "Actividades de concientización del plantel.",
        fotos: [
            "imagenes/eventos/cancer_mama.jpg"
        ]
    },

    honores: {
        titulo: "Honores a la bandera",
        descripcion: "Ceremonias cívicas del ITACE.",
        fotos: [
            "imagenes/eventos/honores_bandera.jpg"
        ]
    },

    robotica: {
        titulo: "Exposición de robótica",
        descripcion: "Proyectos tecnológicos de los estudiantes.",
        fotos: [
            "imagenes/eventos/exposicion_robotica.jpg"
        ]
    },

    feria: {
        titulo: "Feria Infantil de Arte, Cultura y Tecnología",
        descripcion: "Actividades artísticas, culturales y tecnológicas.",
        fotos: [
            "imagenes/eventos/feria_infantil.jpg"
        ]
    },

    desfile: {
        titulo: "Desfile del 20 de noviembre",
        descripcion: "Participaciones del ITACE en años anteriores.",
        fotos: [
            "imagenes/eventos/desfile_20_noviembre.jpg"
        ]
    },

    escolta: {
        titulo: "Escolta oficial",
        descripcion: "Fotografías de nuestra escolta.",
        fotos: [
            "imagenes/eventos/escolta_oficial.jpg"
        ]
    },

    danza: {
        titulo: "Danza y concursos culturales",
        descripcion: "Presentaciones y actividades culturales.",
        fotos: [
            "imagenes/eventos/danza_concursos.jpg"
        ]
    }
};

const modalEventos = document.getElementById("modalEventos");
const tituloGaleria = document.getElementById("tituloGaleriaEvento");
const descripcionGaleria = document.getElementById("descripcionGaleriaEvento");
const fotografiasEvento = document.getElementById("fotografiasEvento");
const cerrarModal = document.getElementById("cerrarModalEventos");

function abrirGaleriaEvento(id) {
    const evento = galeriasEventos[id];

    if (!evento) return;

    tituloGaleria.textContent = evento.titulo;
    descripcionGaleria.textContent = evento.descripcion;
    fotografiasEvento.replaceChildren();

    evento.fotos.forEach(ruta => {
        const imagen = document.createElement("img");

        imagen.src = ruta;
        imagen.alt = evento.titulo;
        imagen.loading = "lazy";

        fotografiasEvento.appendChild(imagen);
    });

    modalEventos.classList.add("abierto");
    modalEventos.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function cerrarGaleriaEvento() {
    modalEventos.classList.remove("abierto");
    modalEventos.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.querySelectorAll(".boton-galeria").forEach(boton => {
    boton.addEventListener("click", () => {
        abrirGaleriaEvento(boton.dataset.evento);
    });
});

cerrarModal.addEventListener("click", cerrarGaleriaEvento);

modalEventos.addEventListener("click", evento => {
    if (evento.target === modalEventos) {
        cerrarGaleriaEvento();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarGaleriaEvento();
    }
});
