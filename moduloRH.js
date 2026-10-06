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
    "init-rh": function () {
        router("rh");
    },

    html: `
<section class="container-fluid py-3" id="rrhh-dashboard">

    <!-- =========================================
         ENCABEZADO Y ACCIONES PRINCIPALES
         ========================================= -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 class="mb-1 fw-bold">Recursos Humanos y Nómina</h2>
            <div class="text-muted">Gestión de legajos, validación de habilitaciones y liquidación salarial</div>
        </div>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" onclick="window.rh.exportarNomina()">
                <i class="bi bi-download me-1"></i> Exportar
            </button>
            <button type="button" class="btn btn-primary" onclick="window.rh.abrirModalInvitacion()">
                <i class="bi bi-person-plus-fill me-1"></i> + Invitar Empleado
            </button>
        </div>
    </div>

    <!-- =========================================
         TARJETAS DE RESUMEN (KPIS OPERATIVOS)
         ========================================= -->
    <div class="row g-3 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-primary h-100">
                <div class="card-body">
                    <div class="text-muted small fw-semibold">Personal Activo Habilitado</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <h3 class="mb-0 fw-bold" id="rhKpiTotalActivos">0</h3>
                        <span class="badge bg-primary-subtle text-primary">Operativos</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-info h-100">
                <div class="card-body">
                    <div class="text-muted small fw-semibold">Solicitudes por Validar</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <h3 class="mb-0 fw-bold text-info" id="rhKpiPendientes">0</h3>
                        <span class="badge bg-info-subtle text-info">Autoenrolamiento</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-warning h-100">
                <div class="card-body">
                    <div class="text-muted small fw-semibold">Documentos por Vencer</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <h3 class="mb-0 fw-bold text-warning" id="rhKpiAlertas">0</h3>
                        <span class="badge bg-warning-subtle text-dark">LINTI / Psicofísico</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="card shadow-sm border-start border-4 border-success h-100">
                <div class="card-body">
                    <div class="text-muted small fw-semibold">Masa Salarial Est. (Mes)</div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <h3 class="mb-0 fw-bold" id="rhKpiMasaSalarial">$0.00</h3>
                        <span class="badge bg-success-subtle text-success">Pre-Nómina</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- =========================================
         PESTAÑAS DE NAVEGACIÓN (TAB SYSTEM)
         ========================================= -->
    <ul class="nav nav-tabs mb-4" id="rhTabs" role="tablist">
        <li class="nav-item">
            <button class="nav-link active fw-semibold" id="tab-solicitudes" data-bs-toggle="tab" data-bs-target="#pane-solicitudes" type="button" role="tab">
                Solicitudes de Ingreso <span class="badge bg-danger rounded-pill ms-1" id="rhBadgeSolicitudesCount">0</span>
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link fw-semibold" id="tab-empleados" data-bs-toggle="tab" data-bs-target="#pane-empleados" type="button" role="tab">
                Plantilla / Legajos Activos
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link fw-semibold" id="tab-vencimientos" data-bs-toggle="tab" data-bs-target="#pane-vencimientos" type="button" role="tab">
                Control de Vencimientos
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link fw-semibold" id="tab-nomina" data-bs-toggle="tab" data-bs-target="#pane-nomina" type="button" role="tab">
                Liquidación de Nómina
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link fw-semibold" id="tab-formulas" data-bs-toggle="tab" data-bs-target="#pane-formulas" type="button" role="tab">
                Fórmulas y Tarifas
            </button>
        </li>
    </ul>

    <!-- =========================================
         CONTENIDO DE PESTAÑAS
         ========================================= -->
    <div class="tab-content" id="rhTabsContent">

        <!-- PESTAÑA 1: SOLICITUDES DE INGRESO -->
        <div class="tab-pane fade show active" id="pane-solicitudes" role="tabpanel">
            <div class="card shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <strong class="mb-0">Bandeja de Validación de Autoenrolamiento</strong>
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.rh.cargarSolicitudes()">
                        <i class="bi bi-arrow-clockwise"></i> Actualizar
                    </button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr class="small text-muted">
                                    <th>Fecha Registro</th>
                                    <th>Candidato</th>
                                    <th>Especialidad / Rol</th>
                                    <th>Contacto / WhatsApp</th>
                                    <th>Documentación Adjunta</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaSolicitudesBody">
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-4">
                                        No hay solicitudes de autoenrolamiento pendientes de revisión.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- PESTAÑA 2: PLANTILLA DE EMPLEADOS ACTIVOS -->
        <div class="tab-pane fade" id="pane-empleados" role="tabpanel">
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row g-2">
                        <div class="col-12 col-md-5">
                            <label for="rhBuscarEmpleado" class="form-label small fw-bold">Buscar Legajo</label>
                            <input type="search" id="rhBuscarEmpleado" class="form-control" placeholder="Nombre, legajo, DNI o teléfono..." onkeyup="window.rh.buscarEmpleado(this.value)">
                        </div>
                        <div class="col-6 col-md-3">
                            <label for="rhFiltroRol" class="form-label small fw-bold">Especialidad de Carga</label>
                            <select id="rhFiltroRol" class="form-select" onchange="window.rh.filtrarRol(this.value)">
                                <option value="">Todas las especialidades</option>
                                <option value="chofer_crudo">Chofer Crudo (Peligrosos)</option>
                                <option value="chofer_asfalto">Chofer Asfalto</option>
                                <option value="chofer_aridos">Chofer Áridos / Agua</option>
                                <option value="mecanico">Mecánico / Taller</option>
                                <option value="admin">Administrativo</option>
                            </select>
                        </div>
                        <div class="col-6 col-md-4">
                            <label for="rhFiltroEstado" class="form-label small fw-bold">Estado Habilitación</label>
                            <select id="rhFiltroEstado" class="form-select" onchange="window.rh.filtrarEstado(this.value)">
                                <option value="activo">Habilitado Operativo</option>
                                <option value="bloqueado_doc">Bloqueado por Documentación</option>
                                <option value="licencia">En Licencia / Vacaciones</option>
                                <option value="inactivo">Inactivo / Baja</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-white">
                    <strong>Directorio de Legajos Habilitados</strong>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr class="small text-muted">
                                    <th>Legajo</th>
                                    <th>Empleado</th>
                                    <th>Puesto / Especialidad</th>
                                    <th>Unidad Asignada</th>
                                    <th>Estado Doc.</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaEmpleadosBody">
                                <tr>
                                    <td colspan="6" class="text-center text-muted py-4">
                                        Cargando legajos desde la base de datos...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- PESTAÑA 3: CONTROL DE VENCIMIENTOS -->
        <div class="tab-pane fade" id="pane-vencimientos" role="tabpanel">
            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">
                    Monitoreo Preventivo de Licencias y Habilitaciones
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr class="small text-muted">
                                    <th>Empleado</th>
                                    <th>Tipo de Documento</th>
                                    <th>Fecha de Vencimiento</th>
                                    <th>Días Restantes</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="rhTablaVencimientosBody">
                                <tr>
                                    <td colspan="6" class="text-center text-muted py-4">
                                        No hay licencias o exámenes médicos próximos a vencer.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- PESTAÑA 4: LIQUIDACIÓN DE NÓMINA -->
        <div class="tab-pane fade" id="pane-nomina" role="tabpanel">
            <div class="card shadow-sm mb-3">
                <div class="card-body">
                    <div class="row align-items-center g-2">
                        <div class="col-12 col-md-4">
                            <label class="form-label small fw-bold">Periodo Salarial</label>
                            <input type="month" id="rhPeriodoNomina" class="form-control" onchange="window.rh.cambiarPeriodo(this.value)">
                        </div>
                        <div class="col-12 col-md-8 text-end mt-2 mt-md-0">
                            <button type="button" class="btn btn-outline-primary me-2" onclick="window.rh.calcularNomina()">
                                Recalcular Fórmulas y Viajes
                            </button>
                            <button type="button" class="btn btn-success" onclick="window.rh.cerrarNomina()">
                                Aprobar y Transferir a Contabilidad
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">
                    Pre-liquidación de Sueldos y Conceptos Variables
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle">
                            <thead class="table-light">
                                <tr class="small text-muted">
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
                                        Seleccione un periodo para liquidar la nómina.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- PESTAÑA 5: FÓRMULAS Y TARIFAS -->
        <div class="tab-pane fade" id="pane-formulas" role="tabpanel">
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                            <span>Tarifas por Km / Tipo de Carga</span>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.rh.nuevaTarifa()">+</button>
                        </div>
                        <div class="card-body" id="rhListaTarifas">
                            <p class="text-muted small mb-0">Cargando parámetros de cálculo por carga peligrosa/áridos...</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                            <span>Reglas de Retenciones y Estímulos</span>
                            <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.rh.nuevaRegla()">+</button>
                        </div>
                        <div class="card-body" id="rhListaReglas">
                            <p class="text-muted small mb-0">Cargando reglas de aportes y premios por presentismo/remitos...</p>
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
        alert("RH → Nuevo empleado");
        console.log("[RH] nuevoUsuario()");
    },

    // ========================================================
    // EDITAR INFORMACIÓN DEL EMPLEADO
    // ========================================================
    editarUsuario(idUsuario = null) {
        alert("RH → Editar empleado" + (idUsuario ? "\nID: " + idUsuario : ""));
        console.log("[RH] editarUsuario()", idUsuario);
    },

    // ========================================================
    // EDITAR ROLES
    // ========================================================
    editarRoles(idUsuario = null) {
        alert("RH → Editar roles" + (idUsuario ? "\nID: " + idUsuario : ""));
        console.log("[RH] editarRoles()", idUsuario);
    },

    // ========================================================
    // CAMBIAR ESTADO
    // ========================================================
    cambiarEstado(idUsuario = null) {
        alert("RH → Cambiar estado" + (idUsuario ? "\nID: " + idUsuario : ""));
        console.log("[RH] cambiarEstado()", idUsuario);
    }

};
