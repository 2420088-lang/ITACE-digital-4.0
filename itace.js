document.addEventListener("DOMContentLoaded", () => {

    // Elementos principales
    const botonTema = document.getElementById("botonTema");
    const botonMenu = document.getElementById("botonMenu");
    const menu = document.getElementById("menu");

    // Tema claro y oscuro
    if (botonTema) {
        botonTema.addEventListener("click", () => {
            document.body.classList.toggle("modo-oscuro");

            const oscuro = document.body.classList.contains("modo-oscuro");
            botonTema.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";

            localStorage.setItem("temaITACE", oscuro ? "oscuro" : "claro");
        });
    }

    if (localStorage.getItem("temaITACE") === "oscuro") {
        document.body.classList.add("modo-oscuro");
        if (botonTema) botonTema.textContent = "☀️ Modo claro";
    }

    // Menú para celular
    if (botonMenu && menu) {
        botonMenu.addEventListener("click", () => {
            menu.classList.toggle("menu-abierto");

            const abierto = menu.classList.contains("menu-abierto");
            botonMenu.setAttribute("aria-expanded", abierto);
        });

        menu.querySelectorAll("a").forEach(enlace => {
            enlace.addEventListener("click", () => {
                menu.classList.remove("menu-abierto");
                botonMenu.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Cerrar el menú al cambiar de sección
    document.querySelectorAll('a[href^="#"]').forEach(enlace => {
        enlace.addEventListener("click", () => {
            const destino = document.querySelector(enlace.getAttribute("href"));

            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Mostrar elementos al desplazarse
    const elementos = document.querySelectorAll(
        ".revelar, .tarjeta, .evento, .instalacion-card"
    );

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12 });

        elementos.forEach(elemento => observador.observe(elemento));
    } else {
        elementos.forEach(elemento => elemento.classList.add("visible"));
    }

    // Historia desplegable
    const botonHistoria = document.getElementById("botonHistoria");
    const ventanaHistoria = document.getElementById("ventanaHistoria");

    if (botonHistoria && ventanaHistoria) {
        botonHistoria.addEventListener("click", () => {
            const expandida = ventanaHistoria.classList.toggle("historia-abierta");

            botonHistoria.textContent = expandida
                ? "Leer menos ▲"
                : "Conocer más ▼";

            botonHistoria.setAttribute("aria-expanded", expandida);
        });
    }

    // Curiosidades del ITACE
    const curiosidades = [
        "El trabajo en equipo ayuda a desarrollar nuevas habilidades.",
        "Los proyectos escolares permiten aplicar lo aprendido en clase.",
        "La programación combina lógica, creatividad y solución de problemas.",
        "Las actividades culturales fomentan la convivencia estudiantil.",
        "Aprender una especialidad técnica puede abrir nuevas oportunidades."
    ];

    const botonCuriosidad = document.getElementById("botonCuriosidad");
    const textoCuriosidad = document.getElementById("textoCuriosidad");

    if (botonCuriosidad && textoCuriosidad) {
        botonCuriosidad.addEventListener("click", () => {
            const actual = textoCuriosidad.textContent;
            let nueva;

            do {
                nueva = curiosidades[
                    Math.floor(Math.random() * curiosidades.length)
                ];
            } while (nueva === actual && curiosidades.length > 1);

            textoCuriosidad.textContent = nueva;
        });
    }

    // Preguntas frecuentes
    document.querySelectorAll(".pregunta-faq").forEach(pregunta => {
        pregunta.addEventListener("click", () => {
            const respuesta = pregunta.nextElementSibling;
            const abierta = pregunta.getAttribute("aria-expanded") === "true";

            pregunta.setAttribute("aria-expanded", String(!abierta));

            if (respuesta) {
                respuesta.hidden = abierta;
            }
        });
    });

    // Carruseles 3D
    document.querySelectorAll("[data-carrusel]").forEach(carrusel => {
        const tarjetas = Array.from(
            carrusel.querySelectorAll(".tarjeta-carrusel")
        );

        const anterior = carrusel.querySelector(".carrusel-anterior");
        const siguiente = carrusel.querySelector(".carrusel-siguiente");
        const puntos = carrusel.querySelector(".carrusel-puntos");

        if (!tarjetas.length) return;

        let posicion = tarjetas.findIndex(tarjeta =>
            tarjeta.classList.contains("activa")
        );

        if (posicion < 0) posicion = 0;

        function mostrarCarrusel() {
            tarjetas.forEach((tarjeta, indice) => {
                tarjeta.classList.remove(
                    "activa",
                    "lado-izquierdo",
                    "lado-derecho"
                );

                tarjeta.removeAttribute("aria-current");

                if (indice === posicion) {
                    tarjeta.classList.add("activa");
                    tarjeta.setAttribute("aria-current", "true");
                } else if (
                    indice === (posicion - 1 + tarjetas.length) % tarjetas.length
                ) {
                    tarjeta.classList.add("lado-izquierdo");
                } else if (
                    indice === (posicion + 1) % tarjetas.length
                ) {
                    tarjeta.classList.add("lado-derecho");
                }
            });

            if (puntos) {
                puntos.querySelectorAll("button").forEach((punto, indice) => {
                    punto.classList.toggle("activo", indice === posicion);
                    punto.setAttribute(
                        "aria-current",
                        indice === posicion ? "true" : "false"
                    );
                });
            }
        }

        function crearPuntos() {
            if (!puntos) return;

            puntos.innerHTML = "";

            tarjetas.forEach((tarjeta, indice) => {
                const punto = document.createElement("button");
                punto.type = "button";
                punto.textContent = String(indice + 1);
                punto.setAttribute(
                    "aria-label",
                    `Mostrar elemento ${indice + 1}`
                );

                punto.addEventListener("click", () => {
                    posicion = indice;
                    mostrarCarrusel();
                });

                puntos.appendChild(punto);
            });
        }

        if (anterior) {
            anterior.addEventListener("click", () => {
                posicion = (posicion - 1 + tarjetas.length) % tarjetas.length;
                mostrarCarrusel();
            });
        }

        if (siguiente) {
            siguiente.addEventListener("click", () => {
                posicion = (posicion + 1) % tarjetas.length;
                mostrarCarrusel();
            });
        }

        tarjetas.forEach((tarjeta, indice) => {
            tarjeta.addEventListener("click", () => {
                if (indice !== posicion) {
                    posicion = indice;
                    mostrarCarrusel();
                }
            });
        });

        crearPuntos();
        mostrarCarrusel();
    });

    // Buscar docentes
    const buscadorDocentes = document.getElementById("buscadorDocentes");
    const tarjetasDocentes = document.querySelectorAll(".tarjeta-docente");
    const mensajeSinDocentes = document.getElementById("sinDocentes");

    function filtrarDocentes() {
        if (!buscadorDocentes) return;

        const busqueda = buscadorDocentes.value
            .trim()
            .toLocaleLowerCase("es");

        let encontrados = 0;

        tarjetasDocentes.forEach(tarjeta => {
            const contenido = tarjeta.textContent.toLocaleLowerCase("es");
            const coincide = contenido.includes(busqueda);

            tarjeta.hidden = !coincide;

            if (coincide) encontrados++;
        });

        if (mensajeSinDocentes) {
            mensajeSinDocentes.hidden = encontrados !== 0;
        }
    }

    if (buscadorDocentes) {
        buscadorDocentes.addEventListener("input", filtrarDocentes);
    }

    // Botón para subir
    const botonArriba = document.getElementById("botonArriba");

    function revisarDesplazamiento() {
        if (botonArriba) {
            botonArriba.classList.toggle("mostrar", window.scrollY > 350);
        }
    }

    window.addEventListener("scroll", revisarDesplazamiento);
    revisarDesplazamiento();

    if (botonArriba) {
        botonArriba.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Año del pie de página
    document.querySelectorAll(".anio-actual").forEach(elemento => {
        elemento.textContent = new Date().getFullYear();
    });

});