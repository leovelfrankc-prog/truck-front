/**

============================================================

MÓDULO RECURSOS HUMANOS

============================================================

Vista principal:

window.rh.html

Funciones:

window.rh.usuarios()

window.rh.nuevoUsuario()

window.rh.editarUsuario()

window.rh.editarRoles()

window.rh.cambiarEstado()

Por el momento las funciones solamente

muestran alertas para comprobar funcionamiento.

============================================================
*/

window.rh = {

// ========================================================
// VISTA PRINCIPAL DEL MÓDULO
// ========================================================

html: `

    <section class="container-fluid py-3">

        <!-- =========================================
             ENCABEZADO
             ========================================= -->

        <div class="d-flex justify-content-between align-items-center mb-4">

            <div>

                <h2 class="mb-1">
                    Recursos Humanos
                </h2>

                <div class="text-muted">
                    Administración de usuarios y empleados
                </div>

            </div>

        </div>


        <!-- =========================================
             INDICADORES
             ========================================= -->

        <div class="row g-3 mb-4">

            <!-- EMPLEADOS -->

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="text-muted small">
                            EMPLEADOS
                        </div>

                        <div class="fs-2 fw-bold">
                            0
                        </div>

                    </div>

                </div>

            </div>


            <!-- ACTIVOS -->

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="text-muted small">
                            ACTIVOS
                        </div>

                        <div class="fs-2 fw-bold text-success">
                            0
                        </div>

                    </div>

                </div>

            </div>


            <!-- INACTIVOS -->

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="text-muted small">
                            INACTIVOS
                        </div>

                        <div class="fs-2 fw-bold text-secondary">
                            0
                        </div>

                    </div>

                </div>

            </div>


            <!-- CHOFERES -->

            <div class="col-12 col-sm-6 col-lg-3">

                <div class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="text-muted small">
                            CHOFERES
                        </div>

                        <div class="fs-2 fw-bold text-primary">
                            0
                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- =========================================
             ACCIONES
             ========================================= -->

        <div class="card shadow-sm mb-4">

            <div class="card-header">

                <strong>
                    Acciones
                </strong>

            </div>


            <div class="card-body">

                <div class="d-flex flex-wrap gap-2">

                    <button
                        type="button"
                        class="btn btn-primary"
                        onclick="window.rh.nuevoUsuario()"
                    >
                        + Agregar usuario
                    </button>


                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        onclick="window.rh.usuarios()"
                    >
                        Administrar usuarios
                    </button>

                </div>

            </div>

        </div>


        <!-- =========================================
             CONTENIDO INFERIOR
             ========================================= -->

        <div class="row g-3">

            <!-- PERSONAL POR ROL -->

            <div class="col-12 col-lg-6">

                <div class="card shadow-sm h-100">

                    <div class="card-header">

                        <strong>
                            Personal por rol
                        </strong>

                    </div>


                    <div class="card-body">

                        <div class="list-group list-group-flush">

                            <div class="list-group-item d-flex justify-content-between">
                                <span>Chofer</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                            <div class="list-group-item d-flex justify-content-between">
                                <span>Despachador</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                            <div class="list-group-item d-flex justify-content-between">
                                <span>Mantenimiento</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                            <div class="list-group-item d-flex justify-content-between">
                                <span>RH</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                            <div class="list-group-item d-flex justify-content-between">
                                <span>Economía</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                            <div class="list-group-item d-flex justify-content-between">
                                <span>Admin</span>
                                <span class="badge bg-primary">0</span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ALTAS RECIENTES -->

            <div class="col-12 col-lg-6">

                <div class="card shadow-sm h-100">

                    <div class="card-header">

                        <strong>
                            Altas recientes
                        </strong>

                    </div>


                    <div class="card-body">

                        <div class="text-muted text-center py-4">

                            No hay información disponible.

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </section>

`,


// ========================================================
// ADMINISTRAR USUARIOS
// ========================================================

usuarios() {

    alert(
        "RH → Administrar usuarios"
    );

    console.log(
        "[RH] usuarios()"
    );

},


// ========================================================
// NUEVO USUARIO
// ========================================================

nuevoUsuario() {

    alert(
        "RH → Agregar usuario"
    );

    console.log(
        "[RH] nuevoUsuario()"
    );

},


// ========================================================
// EDITAR USUARIO
// ========================================================

editarUsuario(idUsuario = null) {

    alert(
        "RH → Editar usuario" +
        (
            idUsuario
                ? "\nID: " + idUsuario
                : ""
        )
    );

    console.log(
        "[RH] editarUsuario()",
        idUsuario
    );

},


// ========================================================
// EDITAR ROLES
// ========================================================

editarRoles(idUsuario = null) {

    alert(
        "RH → Editar roles" +
        (
            idUsuario
                ? "\nID: " + idUsuario
                : ""
        )
    );

    console.log(
        "[RH] editarRoles()",
        idUsuario
    );

},


// ========================================================
// CAMBIAR ESTADO
// ========================================================

cambiarEstado(idUsuario = null) {

    alert(
        "RH → Cambiar estado" +
        (
            idUsuario
                ? "\nID: " + idUsuario
                : ""
        )
    );

    console.log(
        "[RH] cambiarEstado()",
        idUsuario
    );

}


};
