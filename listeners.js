/**
 * ==================================================
 * LISTENERS UNIVERSALES TRUCKERO
 * ==================================================
 *
 * Ejemplos:
 *
 * data-modulo="empresa"
 * data-accion="registrar"
 *
 * Ejecuta:
 *
 * window.empresa.registrar(info)
 *
 * --------------------------------------------------
 */

(() => {

    // ==================================================
    // EJECUTAR FUNCIÓN DEL MÓDULO
    // ==================================================
    function ejecutarFuncion(modulo, accion, info) {

        const objetoModulo = window[modulo];

        if (!objetoModulo) {

            console.warn(
                `[LISTENER] Módulo no encontrado: ${modulo}`
            );

            return;
        }

        let destino = objetoModulo;

        const partes = accion.split(".");

        for (const parte of partes) {

            destino = destino?.[parte];

            if (!destino) {

                console.warn(
                    `[LISTENER] Acción no encontrada: ${modulo}.${accion}`
                );

                return;
            }
        }

        if (typeof destino !== "function") {

            console.warn(
                `[LISTENER] No es una función: ${modulo}.${accion}`
            );

            return;
        }

        try {

            destino(info);

        } catch (error) {

            console.error(
                `[LISTENER] Error ejecutando ${modulo}.${accion}`,
                error
            );

        }
    }

    // ==================================================
    // CONSTRUIR INFO ESTÁNDAR
    // ==================================================
    function construirInfo(evento, elemento) {

        return {

            modulo:
                elemento.dataset.modulo || "",

            accion:
                elemento.dataset.accion || "",

            evento,

            elemento,

            id:
                elemento.id || "",

            nombre:
                elemento.name || "",

            valor:
                elemento.value ?? null,

            texto:
                elemento.textContent?.trim() || "",

            checked:
                elemento.checked ?? false,

            dataset:
                { ...elemento.dataset }

        };
    }

    // ==================================================
    // MANEJADOR UNIVERSAL
    // ==================================================
    function manejarEvento(evento) {

        const elemento =
            evento.target.closest(
                "[data-modulo][data-accion]"
            );

        if (!elemento) return;

        const info =
            construirInfo(
                evento,
                elemento
            );

        ejecutarFuncion(
            info.modulo,
            info.accion,
            info
        );
    }

    // ==================================================
    // EVENTOS GLOBALES
    // ==================================================
    document.addEventListener(
        "click",
        manejarEvento
    );

    document.addEventListener(
        "input",
        manejarEvento
    );

    document.addEventListener(
        "change",
        manejarEvento
    );

})();
