/**

============================================================

MÓDULO RECURSOS HUMANOS

============================================================

Vista principal:

window.rh.html

Funciones:

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
// VISTA PRINCIPAL DE RH
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
                    Administración de empleados
                </div>

            </div>

            <button
                type="button"
                class="btn btn-primary"
                onclick="window.rh.nuevoUsuario()"
            >
                + Nuevo empleado
            </button>

        </div>


        <!-- =========================================
             BUSCAR
             ========================================= -->

        <div class="card shadow-sm mb-4">

            <div class="card-body">

                <label
                    for="rhBuscarEmpleado"
                    class="form-label"
                >
                    Buscar empleado
                </label>

                <input
                    type="search"
                    id="rhBuscarEmpleado"
                    class="form-control"
                    placeholder="Nombre, email o teléfono..."
                >

            </div>

        </div>


        <!-- =========================================
             LISTA DE EMPLEADOS
             ========================================= -->

        <div class="card shadow-sm">

            <div class="card-header">

                <strong>
                    Empleados
                </strong>

            </div>


            <div class="card-body p-0">

                <div class="table-responsive">

                    <table class="table table-hover mb-0">

                        <thead>

                            <tr>

                                <th>
                                    Nombre
                                </th>

                                <th>
                                    Rol principal
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th class="text-end">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <!--
                                Datos temporales.
                                Posteriormente serán cargados
                                desde el backend.
                            -->

                            <tr>

                                <td>
                                    Juan Pérez
                                </td>

                                <td>
                                    Chofer
                                </td>

                                <td>

                                    <span class="badge bg-success">
                                        Activo
                                    </span>

                                </td>

                                <td class="text-end">

                                    <div class="btn-group">

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-primary"
                                            onclick="window.rh.editarUsuario('USU_0001')"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary"
                                            onclick="window.rh.editarRoles('USU_0001')"
                                        >
                                            Roles
                                        </button>

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-warning"
                                            onclick="window.rh.cambiarEstado('USU_0001')"
                                        >
                                            Estado
                                        </button>

                                    </div>

                                </td>

                            </tr>


                            <tr>

                                <td
                                    colspan="4"
                                    class="text-center text-muted py-4"
                                >
                                    Los empleados se cargarán desde el backend.

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    </section>

`,


// ========================================================
// NUEVO USUARIO / EMPLEADO
// ========================================================

nuevoUsuario() {

    alert(
        "RH → Nuevo empleado"
    );

    console.log(
        "[RH] nuevoUsuario()"
    );

},


// ========================================================
// EDITAR INFORMACIÓN DEL EMPLEADO
// ========================================================

editarUsuario(idUsuario = null) {

    alert(
        "RH → Editar empleado" +
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
