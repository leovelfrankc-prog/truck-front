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
         ENCABEZADO Y ACCIONES PRINCIPALES
         ========================================= -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="mb-1">Recursos Humanos y Nómina</h2>
            <div class="text-muted">Gestión de legajos, habilitaciones de transporte y liquidación salarial</div>
        </div>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" onclick="window.rh.exportarNomina()">
                Exportar
            </button>
            <button type="button" class="btn btn-primary" onclick="window.rh.nuevoUsuario()">
                + Nuevo empleado
            </button>
        </div>
    </div>

    <!-- =========================================
         TARJETAS DE RESUMEN (KPIS)
         ========================================= -->
    <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-primary h-100">
                <div class="card-body">
                    <div class="text-muted small">Personal Activo</div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <h3 class="mb-0 fw-bold" id="rhKpiTotal">0</h3>
                        <span class="badge bg-primary-subtle text-primary">Choferes / Taller</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-warning h-100">
                <div class="card-body">
                    <div class="text-muted small">Documentos por Vencer</div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <h3 class="mb-0 fw-bold text-warning" id="rhKpiAlertas">0</h3>
                        <span class="badge bg-warning-subtle text-dark">LINTI / Med.</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-success h-100">
                <div class="card-body">
                    <div class="text-muted small">Masa Salarial Est.</div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <h3 class="mb-0 fw-bold" id="rhKpiMasaSalarial">$0.00</h3>
                        <span class="badge bg-success-subtle text-success">Mes Actual</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-info h-100">
                <div class="card-body">
                    <div class="text-muted small">Anticipos Solicitados</div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <h3 class="mb-0 fw-bold" id="rhKpiAnticipos">$0.00</h3>
                        <span class="badge bg-info-subtle text-info">Pendientes</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- =========================================
         PESTAÑA DE NAVEGACIÓN
         ========================================= -->
    <ul class="nav nav-tabs mb-4" id="rhTabs" role="tablist">
        <li class="nav-item">
            <button class="nav-link active" id="tab-empleados" data-bs-toggle="tab" data-bs-target="#pane-empleados" type="button" role="tab">
                Empleados
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link" id="tab-vencimientos" data-bs-toggle="tab" data-bs-target="#pane-vencimientos" type="button" role="tab">
                Vencimientos / Habilitaciones
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link" id="tab-nomina" data-bs-toggle="tab" data-bs-target="#pane-nomina" type="button" role="tab">
                Liquidación de Nómina
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link" id="tab-formulas" data-bs-toggle="tab" data-bs-target="#pane-formulas" type="button" role="tab">
                Fórmulas y Estímulos
            </button>
        </li>
    </ul>

    <div class="tab-content" id="rhTabsContent">

        <!-- =========================================
             PESTAÑA 1: LISTADO DE EMPLEADOS
             ========================================= -->
        <div class="tab-pane fade show active" id="pane-empleados" role="tabpanel">
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row g-2">
                        <div class="col-12 col-md-6">
                            <label for="rhBuscarEmpleado" class="form-label small fw-bold">Buscar empleado</label>
                            <input type="search" id="rhBuscarEmpleado" class="form-control" placeholder="Nombre, legajo, DNI o teléfono..." onkeyup="window.rh.buscarEmpleado(this.value)">
                        </div>
                        <div class="col-6 col-md-3">
                            <label for="rhFiltroRol" class="form-label small fw-bold">Especialidad / Rol</label>
                            <select id="rhFiltroRol" class="form-select" onchange="window.rh.filtrarRol(this.value)">
                                <option value="">Todos los roles</option>
                                <option value="chofer_crudo">Chofer Crudo / Peligrosos</option>
                                <option value="chofer_asfalto">Chofer Asfalto</option>
                                <option value="chofer_aridos">Chofer Áridos / Agua</option>
                                <option value="mecanico">Mecánico / Taller</option>
                                <option value="admin">Administrativo</option>
                            </select>
                        </div>
                        <div class="col-6 col-md-3">
                            <label for="rhFiltroEstado" class="form-label small fw-bold">Estado</label>
                            <select id="rhFiltroEstado" class="form-select" onchange="window.rh.filtrarEstado(this.value)">
                                <option value="activo">Activo</option>
                                <option value="licencia">En Licencia</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <strong>Listado de Empleados</strong>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Legajo</th>
                                    <th>Nombre</th>
                                    <th>Especialidad / Rol</th>
                                    <th>Unidad Asignada</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaEmpleadosBody">
                                <!-- Filas dinámicas generadas desde el backend -->
                                <tr>
                                    <td colspan="6" class="text-center text-muted py-4">
                                        Cargando empleados desde el servidor...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- =========================================
             PESTAÑA 2: VENCIMIENTOS Y DOCUMENTOS
             ========================================= -->
        <div class="tab-pane fade" id="pane-vencimientos" role="tabpanel">
            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">
                    Control de Licencias y Exámenes Médicos
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Empleado</th>
                                    <th>Documento / Certificación</th>
                                    <th>Fecha Vencimiento</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaVencimientosBody">
                                <tr>
                                    <td colspan="5" class="text-center text-muted py-4">
                                        No hay alertas de vencimiento registradas.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- =========================================
             PESTAÑA 3: LIQUIDACIÓN DE NÓMINA
             ========================================= -->
        <div class="tab-pane fade" id="pane-nomina" role="tabpanel">
            <div class="card shadow-sm mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-12 col-md-4">
                            <label class="form-label small fw-bold">Periodo Salarial</label>
                            <input type="month" id="rhPeriodoNomina" class="form-control" onchange="window.rh.cambiarPeriodo(this.value)">
                        </div>
                        <div class="col-12 col-md-8 text-end mt-3 mt-md-0">
                            <button type="button" class="btn btn-outline-primary me-2" onclick="window.rh.calcularNomina()">
                                Recalcular Fórmulas
                            </button>
                            <button type="button" class="btn btn-success" onclick="window.rh.cerrarNomina()">
                                Cierre de Nómina
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">
                    Pre-liquidación de Sueldos
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Empleado</th>
                                    <th>Básico</th>
                                    <th>Variables (Km/Viajes)</th>
                                    <th>Estímulos</th>
                                    <th>Retenciones</th>
                                    <th>Neto a Cobrar</th>
                                    <th class="text-end">Recibo</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaNominaBody">
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-4">
                                        Seleccione un periodo para consultar la nómina.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- =========================================
             PESTAÑA 4: FÓRMULAS Y ESTÍMULOS
             ========================================= -->
        <div class="tab-pane fade" id="pane-formulas" role="tabpanel">
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                            <span>Tarifas por Tipo de Carga / Km</span>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.rh.nuevaTarifa()">+</button>
                        </div>
                        <div class="card-body" id="rhListaTarifas">
                            <p class="text-muted small">Cargando parámetros de cálculo...</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                            <span>Reglas de Estímulos y Retenciones</span>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.rh.nuevaRegla()">+</button>
                        </div>
                        <div class="card-body" id="rhListaReglas">
                            <p class="text-muted small">Cargando reglas de retención...</p>
                        </div>
                    </div>
                </div>
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
