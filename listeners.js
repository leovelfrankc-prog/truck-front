/**
 * ==================================================
 * LISTENERS UNIVERSALES TRUCKERO
 * ==================================================
 *
 * Convención:
 *
 * data-modulo="empresa"
 * data-accion="crearEmpresa"
 *
 * genera:
 *
 * empresacrearEmpresa(info)
 *
 * --------------------------------------------------
 */

(() => {

    /**
     * Ejecuta la función modulo+accion
     */
    function ejecutarFuncion(modulo, accion, info) {

        const nombreFuncion =
            `${modulo}${accion}`;

        const funcion =
            window[nombreFuncion];

        if (typeof funcion !== "function") {

            console.warn(
                `Función no encontrada: ${nombreFuncion}`
            );

            return;
        }

        try {

            funcion(info);

        } catch (error) {

            console.error(
                `Error ejecutando ${nombreFuncion}`,
                error
            );

        }

    }

    /**
     * Construye objeto estándar
     */
    function construirInfo(
        evento,
        elemento
    ) {

        const modulo =
            elemento.dataset.modulo || "";

        const accion =
            elemento.dataset.accion || "";

        return {

            modulo,
            accion,

            evento,

            elemento,

            id:
                elemento.id || "",

            nombre:
                elemento.name || "",

            valor:
                elemento.value ?? null,

            texto:
                elemento.textContent || "",

            dataset:
                { ...elemento.dataset }

        };

    }

    /**
     * CLICK
     */
    document.addEventListener(
        "click",
        (evento) => {

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
    );

    /**
     * INPUT
     */
    document.addEventListener(
        "input",
        (evento) => {

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
    );

    /**
     * CHANGE
     */
    document.addEventListener(
        "change",
        (evento) => {

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
    );

})();
