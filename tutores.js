var cuerpo = document.getElementById("cuerpo");
var acreditacion;

//para mantener la sesion iniciada
function menu(){
    axios.post("http://localhost:3000/tutores/login", acreditacion)
        .then(response => {
            let id_curso = response.data.id_curso;
            console.log("ID del curso recibido:", id_curso);

            // Insertar botones en el contenedor "cuerpo"
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white text-center">
                    <h2 class="text-primary mb-3">Opciones</h2>
                    <button class="btn btn-success m-2" onclick="insertarEmpresas()">Insertar Empresas</button>
                    <button class="btn btn-success m-2" onclick="insertarContactos()">Insertar Contactos</button>
                    <button class="btn btn-success m-2" onclick="asignarFase(${id_curso})">Asignar Cursos a FCT</button>
                    <button class="btn btn-success m-2" onclick="mostrarAlumnos(${id_curso})">Ver alumnos</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error en el login:", error);
            alert("Error en el login. Verifica tus credenciales.");
        });
}

//para recoger los datos para el login
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    acreditacion = {
        email: email,
        password: password
    };
    menu();
}

//funciones para insertar una empresa
function insertarEmpresas() {
    cuerpo.innerHTML = `
        <div class="container mt-4 p-4 border rounded shadow bg-white">
            <h2 class="text-primary text-center mb-3">Insertar Nueva Empresa</h2>
            <form id="formInsertarEmpresa">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre de la Empresa:</label>
                    <input type="text" id="nombre" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección:</label>
                    <input type="text" id="direccion" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono:</label>
                    <input type="text" id="telefono" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico:</label>
                    <input type="email" id="email" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="sector" class="form-label">Sector:</label>
                    <input type="text" id="sector" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="tipo" class="form-label">Tipo de Empresa:</label>
                    <select id="tipo" class="form-control">
                        <option value="Pequeña">Pequeña</option>
                        <option value="Mediana">Mediana</option>
                        <option value="Grande">Grande</option>
                    </select>
                </div>
                <div class="d-flex justify-content-between">
                    <button type="submit" class="btn btn-success">Guardar Empresa</button>
                    <button onclick="menu()" type="button" class="btn btn-light">Menú Principal</button>
                </div>
            </form>
        </div>
    `;

    // Agregar el evento submit al formulario
    document.getElementById("formInsertarEmpresa").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar recarga de la página

        // Obtener valores del formulario
        const nuevaEmpresa = {
            nombre_empresa: document.getElementById("nombre").value,
            direccion_empresa: document.getElementById("direccion").value,
            telefono_empresa: document.getElementById("telefono").value,
            email_empresa: document.getElementById("email").value,
            sector_empresa: document.getElementById("sector").value,
            tipo_empresa: document.getElementById("tipo").value
        };

        // Enviar datos al backend
        axios.post("http://localhost:3000/empresas/insertar", nuevaEmpresa)
            .then(response => {
                alert("Empresa insertada correctamente.");
                menu(); // Volver al menú principal
            })
            .catch(error => {
                console.error("Error al insertar empresa:", error);
                alert("Error al insertar la empresa. Revisa la consola para más detalles.");
            });
    });
}

//asigar fases a las fct
function asignarFase(id_curso) {
    axios.put("http://localhost:3000/practicas/asignarFase", { id_curso: id_curso })
        .then(response => {
            alert(response.data.message);  // Mensaje de éxito
        })
        .catch(error => {
            console.error("Error al asignar fase:", error);
            alert("Hubo un error al asignar la fase.");
        });
}

// Obtener alumnos de un curso
function mostrarAlumnos(id_curso) {
    cuerpo.innerHTML = "<p>Cargando...</p>";  // Mostrar mensaje de carga

    axios.get(`http://localhost:3000/alumnos/${id_curso}`)
        .then(response => {
            if (response.data.length === 0) {
                cuerpo.innerHTML = "<p>No hay alumnos en este curso.</p>";
                return;
            }

            let contenido = `<table class="table table-bordered table-striped">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>Fecha Nacimiento</th>
                                        <th>Género</th>
                                        <th>Fecha Ingreso</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            response.data.forEach(alumno => {
                const fechaNacimiento = new Date(alumno.fecha_nacimiento).toLocaleDateString('es-ES');
                const fechaIngreso = new Date(alumno.fecha_ingreso).toLocaleDateString('es-ES');
                contenido += `<tr>
                                <td>${alumno.nombre}</td>
                                <td>${alumno.email}</td>
                                <td>${alumno.telefono}</td>
                                <td>${alumno.direccion}</td>
                                <td>${fechaNacimiento}</td>
                                <td>${alumno.genero}</td>
                                <td>${fechaIngreso}</td>
                                <td onclick="editarPracticas(${alumno.id})" class="bg-primary text-white">Editar Fase</td>
                              </tr>`;
            });

            contenido += "</tbody></table><button onclick=menu() class='btn btn-light'>menu principal</button>";
            cuerpo.innerHTML = contenido;
        })
        .catch(error => {
            console.error("Error:", error);
            cuerpo.innerHTML = "<p>Error al cargar los alumnos.</p>";
        });
}
// Mostrar prácticas del alumno
function editarPracticas(id_alumno) {
    let cuerpo = document.getElementById('cuerpo');
    cuerpo.innerHTML = "";  // Limpiar todo el contenido del cuerpo (incluido el botón)

    axios.get(`http://localhost:3000/practicas/${id_alumno}`)
        .then(response => {
            let alumno = response.data[0];
            const fecha_inicio = new Date(alumno.fecha_inicio).toLocaleDateString('es-ES');
            const fecha_fin = new Date(alumno.fecha_fin).toLocaleDateString('es-ES');

            let contenido = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3">Modificar Alumno</h2>
                    
                    <div class="mb-3">
                        <label class="form-label" for="nombre">Nombre del Alumno</label>
                        <input type="text" class="form-control" id="nombre" value="${alumno.alumno}">
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="fase">Fase</label>
                        <select id="fase" class="form-select">
                            <option value="no_realiza_practicas" ${alumno.fase === "no_realiza_practicas" ? "selected" : ""}>No realiza prácticas</option>
                            <option value="pendiente_asignacion" ${alumno.fase === "pendiente_asignacion" ? "selected" : ""}>Pendiente de asignación prácticas</option>
                            <option value="asignado_empresa" ${alumno.fase === "asignado_empresa" ? "selected" : ""}>Asignado a empresa</option>
                            <option value="realizacion_convenio" ${alumno.fase === "realizacion_convenio" ? "selected" : ""}>Realización convenio</option>
                            <option value="relacion_alumnos" ${alumno.fase === "relacion_alumnos" ? "selected" : ""}>Relación alumnos</option>
                            <option value="programa_horario" ${alumno.fase === "programa_horario" ? "selected" : ""}>Programa y horario</option>
                        </select>
                    </div>

                    <div id="estado-container" class="mb-3"></div> <!-- Select de estado se insertará aquí -->

                    <div id="extra-info" class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label" for="tutor">Tutor</label>
                            <input type="text" class="form-control" id="tutor" value="${alumno.tutor}">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="fecha_inicio">Fecha de Inicio</label>
                            <input type="date" class="form-control" id="fecha_inicio" value="${fecha_inicio}">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="fecha_fin">Fecha de Fin</label>
                            <input type="date" class="form-control" id="fecha_fin" value="${fecha_fin}">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="modalidad">Modalidad</label>
                            <input type="text" class="form-control" id="modalidad" value="${alumno.modalidad}">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="lugar">Lugar</label>
                            <input type="text" class="form-control" id="lugar" value="${alumno.lugar}">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="empresa">Empresa</label>
                            <input type="text" class="form-control" id="empresa" value="${alumno.empresa}">
                        </div>
                    </div>

                    <!-- Botón verde -->
                    <button id="guardar" class="btn btn-success mt-3">Guardar Cambios</button>
                    <!--Botón Menu principal-->
                    <button onclick=menu() class='btn btn-light'>menu principal</button>
                </div>
            `;

            cuerpo.innerHTML = contenido; // Insertar formulario en el cuerpo

            function actualizarEstadoSelect(faseSeleccionada) {
                let estadoContainer = document.getElementById("estado-container");
                estadoContainer.innerHTML = ""; // Limpiar el contenedor

                let selectEstados = {
                    "realizacion_convenio": `
                        <label class="form-label">Estado</label>
                        <select id="estado" class="form-select">
                            <option value="pendiente_realizacion_convenio" ${alumno.estado === "pendiente_realizacion_convenio" ? "selected" : ""}>Pendiente realización de convenio</option>
                            <option value="pendiente_envio_empresa" ${alumno.estado === "pendiente_envio_empresa" ? "selected" : ""}>Pendiente envío de empresa</option>
                            <option value="pendiente_firma_empresa" ${alumno.estado === "pendiente_firma_empresa" ? "selected" : ""}>Pendiente firma de empresa</option>
                            <option value="pendiente_firma_director" ${alumno.estado === "pendiente_firma_director" ? "selected" : ""}>Pendiente firma director</option>
                            <option value="pendiente_firma_comunidad" ${alumno.estado === "pendiente_firma_comunidad" ? "selected" : ""}>Pendiente firma Comunidad</option>
                            <option value="enviado_a_empresa" ${alumno.estado === "enviado_a_empresa" ? "selected" : ""}>Enviado a empresa</option>
                        </select>`,
                    "relacion_alumnos": `
                        <label class="form-label">Estado</label>
                        <select id="estado" class="form-select">
                            <option value="pendiente_realizacion_relacion" ${alumno.estado === "pendiente_realizacion_relacion" ? "selected" : ""}>Pendiente realización de relación</option>
                            <option value="pendiente_envio_empresa" ${alumno.estado === "pendiente_envio_empresa" ? "selected" : ""}>Pendiente envío de empresa</option>
                            <option value="pendiente_firma_empresa" ${alumno.estado === "pendiente_firma_empresa" ? "selected" : ""}>Pendiente firma de empresa</option>
                            <option value="pendiente_firma_director" ${alumno.estado === "pendiente_firma_director" ? "selected" : ""}>Pendiente firma director</option>
                            <option value="enviado_a_empresa" ${alumno.estado === "enviado_a_empresa" ? "selected" : ""}>Enviado a empresa</option>
                        </select>`,
                    "programa_horario": `
                        <label class="form-label">Estado</label>
                        <select id="estado" class="form-select">
                            <option value="pendiente_realizacion_programa" ${alumno.estado === "pendiente_realizacion_programa" ? "selected" : ""}>Pendiente realización de programa</option>
                            <option value="pendiente_envio_empresa" ${alumno.estado === "pendiente_envio_empresa" ? "selected" : ""}>Pendiente envío de empresa</option>
                            <option value="pendiente_firma_empresa" ${alumno.estado === "pendiente_firma_empresa" ? "selected" : ""}>Pendiente firma de empresa</option>
                            <option value="pendiente_firma_tutor" ${alumno.estado === "pendiente_firma_tutor" ? "selected" : ""}>Pendiente firma tutor</option>
                            <option value="enviado_a_empresa" ${alumno.estado === "enviado_a_empresa" ? "selected" : ""}>Enviado a empresa</option>
                        </select>`
                };
                //si es undefined el contenerdor del select de estado estara vacio
                if (selectEstados[faseSeleccionada]) {
                    estadoContainer.innerHTML = selectEstados[faseSeleccionada];
                }
            }
            //si la fase no tiene empresa no muestra los datos de la empresa
            function actualizarExtraInfo(faseSeleccionada) {
                let extraInfo = document.getElementById("extra-info");
                //con classList y toggle podemos añadir o quitar clases al elemento,
                // la condicion si es true la clase se añade sino esta y si es false se quita
                extraInfo.classList.toggle("d-none", faseSeleccionada === "no_realiza_practicas" || faseSeleccionada === "pendiente_asignacion");
            }

            let faseSelect = document.getElementById("fase");
            faseSelect.addEventListener("change", function () {
                actualizarEstadoSelect(this.value);
                actualizarExtraInfo(this.value);
            });

            actualizarEstadoSelect(alumno.fase);
            actualizarExtraInfo(alumno.fase);

            // Función para guardar los cambios
            document.getElementById("guardar").addEventListener("click", function () {
                // Crear objeto con los valores del formulario
                const estado = document.getElementById("estado") ? document.getElementById("estado").value : 'null';

                const alumnoActualizado = {
                    id_alumno: id_alumno,
                    nombre: document.getElementById("nombre").value,
                    fase: document.getElementById("fase").value,
                    estado: estado,
                    tutor: document.getElementById("tutor").value,
                    fecha_inicio: document.getElementById("fecha_inicio").value,
                    fecha_fin: document.getElementById("fecha_fin").value,
                    modalidad: document.getElementById("modalidad").value,
                    lugar: document.getElementById("lugar").value,
                    empresa: document.getElementById("empresa").value
                };

                // Hacer PUT para actualizar
                axios.put('http://localhost:3000/practicas/update', alumnoActualizado)
                    .then(response => {
                        alert('Práctica actualizada exitosamente');
                    })
                    .catch(error => {
                        console.error('Error al actualizar:', error);
                        alert('Hubo un problema al actualizar la práctica.');
                    });
            });
        })
        .catch(error => console.error("Error:", error));
}

//formulario para  guardar contactos de empresa
function insertarContactos() {
    cuerpo.innerHTML = `
        <div class="container mt-4 p-4 border rounded shadow bg-white">
            <h2 class="text-primary mb-3 text-center">Insertar Nuevo Contacto</h2>
            
            <form id="formContacto">
                <div class="mb-3">
                    <label class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" required>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Cargo:</label>
                    <input type="text" class="form-control" id="cargo">
                </div>

                <div class="mb-3">
                    <label class="form-label">Departamento:</label>
                    <input type="text" class="form-control" id="departamento">
                </div>

                <div class="mb-3">
                    <label class="form-label">Email:</label>
                    <input type="email" class="form-control" id="email" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Teléfono:</label>
                    <input type="text" class="form-control" id="telefono">
                </div>

                <div class="mb-3">
                    <label class="form-label">ID Empresa:</label>
                    <input type="number" class="form-control" id="empresa_id" required>
                </div>

                <button type="button" class="btn btn-success" onclick="guardarContacto()">Guardar Contacto</button>
                <button onclick="menu()" class="btn btn-light">Menú Principal</button>
            </form>
        </div>
    `;
}

//funcion para guardar el contacto
function guardarContacto() {
    const contacto = {
        nombre: document.getElementById("nombre").value,
        cargo_contacto: document.getElementById("cargo").value,
        departamento: document.getElementById("departamento").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        empresa_id: document.getElementById("empresa_id").value
    };

    axios.post("http://localhost:3000/contactos", contacto)
        .then(response => {
            alert("Contacto insertado correctamente");
            menu();  // Vuelve al menú principal
        })
        .catch(error => {
            console.error("Error al insertar contacto:", error);
            alert("Hubo un error al insertar el contacto.");
        });
}




