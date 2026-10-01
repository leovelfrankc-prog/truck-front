/**

==================================================

UTILIDADES MODAL UNIVERSAL

==================================================

Este módulo es INDEPENDIENTE de los listeners

universales.

El modal se abre directamente desde cualquier

función:

modal.mostrar(

    "Nuevo cliente",

    formularioHTML,

    "lg"

);


Para cerrar:

modal.cerrar();


Tamaños disponibles:

sm

md

lg

xl


==================================================
*/

(() => {

// ==================================================
// OBTENER ELEMENTOS DEL MODAL
// ==================================================

function obtenerElementos() {

    const modalEl =
        document.getElementById(
            "modalUniversal"
        );

    const dialog =
        document.getElementById(
            "modalUniversalDialog"
        );

    const contenido =
        document.getElementById(
            "modalUniversalContenido"
        );


    if (!modalEl || !dialog || !contenido) {

        console.warn(
            "[MODAL] No se encontró la estructura del modal universal."
        );

        return null;
    }


    return {
        modalEl,
        dialog,
        contenido
    };
}


// ==================================================
// CONFIGURAR TAMAÑO
// ==================================================

function configurarTamaño(
    dialog,
    tamaño
) {

    const tamañosValidos = [
        "sm",
        "md",
        "lg",
        "xl"
    ];


    if (
        !tamañosValidos.includes(
            tamaño
        )
    ) {

        tamaño = "lg";
    }


    dialog.classList.remove(
        "modal-sm",
        "modal-lg",
        "modal-xl"
    );


    // Bootstrap no tiene modal-md.
    // md = tamaño normal.

    if (tamaño !== "md") {

        dialog.classList.add(
            `modal-${tamaño}`
        );
    }
}


// ==================================================
// MOSTRAR MODAL
// ==================================================

function mostrar(
    titulo,
    contenidoHTML,
    tamaño = "lg"
) {

    const elementos =
        obtenerElementos();


    if (!elementos) {
        return;
    }


    // ------------------------------------------------
    // CONFIGURAR TAMAÑO
    // ------------------------------------------------

    configurarTamaño(
        elementos.dialog,
        tamaño
    );


    // ------------------------------------------------
    // CONSTRUIR CONTENIDO
    // ------------------------------------------------

    elementos.contenido.innerHTML = `

        <div class="modal-header">

            <h5 class="modal-title"></h5>

            <button
                type="button"
                class="btn-close"
                aria-label="Cerrar"
                data-modal-cerrar>
            </button>

        </div>


        <div class="modal-body">

            ${contenidoHTML}

        </div>

    `;


    // ------------------------------------------------
    // TÍTULO
    // ------------------------------------------------

    const tituloEl =
        elementos.contenido.querySelector(
            ".modal-title"
        );


    if (tituloEl) {

        tituloEl.textContent =
            titulo ?? "";
    }


    // ------------------------------------------------
    // BOTÓN CERRAR
    // ------------------------------------------------

    const botonCerrar =
        elementos.contenido.querySelector(
            "[data-modal-cerrar]"
        );


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrar
        );
    }


    // ------------------------------------------------
    // MOSTRAR MODAL
    // ------------------------------------------------

    const instancia =
        bootstrap.Modal.getOrCreateInstance(
            elementos.modalEl
        );


    instancia.show();
}


// ==================================================
// CERRAR MODAL
// ==================================================

function cerrar() {

    const modalEl =
        document.getElementById(
            "modalUniversal"
        );


    if (!modalEl) {
        return;
    }


    const instancia =
        bootstrap.Modal.getInstance(
            modalEl
        );


    if (instancia) {

        instancia.hide();
    }
}


// ==================================================
// LIMPIAR MODAL
// ==================================================

function limpiar() {

    const contenido =
        document.getElementById(
            "modalUniversalContenido"
        );


    if (contenido) {

        contenido.innerHTML = "";
    }


    const dialog =
        document.getElementById(
            "modalUniversalDialog"
        );


    if (dialog) {

        dialog.classList.remove(
            "modal-sm",
            "modal-xl"
        );

        dialog.classList.add(
            "modal-lg"
        );
    }
}


// ==================================================
// CUANDO BOOTSTRAP TERMINA DE CERRAR
// ==================================================

document.addEventListener(
    "hidden.bs.modal",
    function (evento) {

        if (
            evento.target.id !==
            "modalUniversal"
        ) {
            return;
        }


        limpiar();
    }
);


// ==================================================
// API PÚBLICA
// ==================================================

window.modal = {

    mostrar,
    cerrar,
    limpiar

};


})();
