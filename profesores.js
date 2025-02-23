var cuerpo = document.getElementById("cuerpo");
var acreditacion;

// Función para mantener la sesión y mostrar el menú
function menu() {
    axios.post("http://localhost:3000/profesores/login", acreditacion)
        .then(response => {
            console.log("Login exitoso:", response.data);

            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white text-center">
                    <h2 class="text-primary mb-3">Opciones</h2>
                    <button class="btn btn-success m-2" onclick="insertarAlumnos()">Insertar Alumnos</button>
                    <button class="btn btn-success m-2" onclick="editarAlumnos()">Ver Alumnos</button>
                    <button class="btn btn-success m-2" onclick="editarEmpresas()">Ver Empresas</button>
                    <button class="btn btn-success m-2" onclick="editarContactos()">Ver contactos</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error en el login:", error);
            alert("Error en el login. Verifica tus credenciales.");
        });
}

// Función para el login
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    acreditacion = { email: email, password: password };
    menu();
}

// Función para insertar un alumno
function insertarAlumnos() {
    cuerpo.innerHTML = `
        <div class="container mt-4 p-4 border rounded shadow bg-white">
            <h2 class="text-primary text-center mb-3">Insertar Nuevo Alumno</h2>
            <form id="formInsertarAlumno">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" id="nombre" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico:</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono:</label>
                    <input type="text" id="telefono" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección:</label>
                    <input type="text" id="direccion" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento:</label>
                    <input type="date" id="fecha_nacimiento" class="form-control">
                </div>
                <div class="mb-3">
                    <label for="curso" class="form-label">Curso:</label>
                    <input type="text" id="curso" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="genero" class="form-label">Género:</label>
                    <select id="genero" class="form-control">
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                </div>
                <div class="d-flex justify-content-between">
                    <button type="submit" class="btn btn-success">Guardar Alumno</button>
                    <button onclick="menu()" type="button" class="btn btn-light">Menú Principal</button>
                </div>
            </form>
        </div>
    `;

    // Evento para manejar la inserción del alumno
    document.getElementById("formInsertarAlumno").addEventListener("submit", function (event) {
        event.preventDefault();

        const nuevoAlumno = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            direccion: document.getElementById("direccion").value,
            fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
            curso: document.getElementById("curso").value,
            genero: document.getElementById("genero").value
        };

        axios.post("http://localhost:3000/alumnos/insertar", nuevoAlumno)
            .then(response => {
                alert("Alumno insertado correctamente.");
                menu();
            })
            .catch(error => {
                console.error("Error al insertar alumno:", error);
                alert("Error al insertar alumno. Revisa la consola.");
            });
    });
}

//mostrar todos los alumnos para permitir la edicionn
function editarAlumnos() {
    axios.get("http://localhost:3000/alumnos")
        .then(response => {
            const alumnos = response.data;
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary text-center mb-3">Editar Alumno</h2>
                    <div class="list-group">
            `;

            // Mostrar cada alumno con un botón de "Editar"
            alumnos.forEach(alumno => {
                cuerpo.innerHTML += `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        ${alumno.nombre}
                        <button class="btn btn-warning" onclick="mostrarFormularioEdicion(${alumno.id})">Editar</button>
                    </div>
                `;
            });

            cuerpo.innerHTML += `<button onclick="menu()" class="btn btn-light">menu principal</button></div>`;
        })
        .catch(error => {
            console.error("Error al obtener los alumnos:", error);
            alert("Error al obtener los alumnos. Revisa la consola.");
        });
}

//formulario para editar los alumnos
// Función para mostrar el formulario de edición con los datos del alumno
function mostrarFormularioEdicion(idAlumno) {
    axios.get(`http://localhost:3000/alumnos/${idAlumno}`)
        .then(response => {
            const alumno = response.data;
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary text-center mb-3">Editar Alumno</h2>
                    <form id="formEditarAlumno">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre:</label>
                            <input type="text" id="nombre" class="form-control" value="${alumno.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label for="curso" class="form-label">Curso:</label>
                            <input type="text" id="curso" class="form-control" value="${alumno.curso}" required>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-success">Guardar Cambios</button>
                            <button onclick="editarAlumnos()" type="button" class="btn btn-light">Volver</button>
                        </div>
                    </form>
                </div>
            `;

            // Evento para manejar la edición del alumno
            document.getElementById("formEditarAlumno").addEventListener("submit", function (event) {
                event.preventDefault();

                const alumnoEditado = {
                    nombre: document.getElementById("nombre").value,
                    curso: document.getElementById("curso").value
                };

                axios.put(`http://localhost:3000/alumnos/editar/${idAlumno}`, alumnoEditado)
                    .then(response => {
                        alert("Alumno actualizado correctamente.");
                        editarAlumnos(); // Vuelve a cargar la lista de alumnos
                    })
                    .catch(error => {
                        console.error("Error al actualizar el alumno:", error);
                        alert("Error al actualizar el alumno. Revisa la consola.");
                    });
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos del alumno:", error);
            alert("Error al obtener los datos del alumno. Revisa la consola.");
        });
}

// Función para mostrar todas las empresas y permitir la edición
function mostrarEmpresas() {
    axios.get("http://localhost:3000/empresas")
        .then(response => {
            let empresas = response.data;
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3 text-center">Lista de Empresas</h2>
                    <table class="table table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Dirección</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${empresas.map(empresa => `
                                <tr>
                                    <td>${empresa.nombre_empresa}</td>
                                    <td>${empresa.estado}</td>
                                    <td>${empresa.direccion_empresa || 'No disponible'}</td>
                                    <td>${empresa.email_empresa || 'No disponible'}</td>
                                    <td>${empresa.telefono_empresa || 'No disponible'}</td>
                                    <td>
                                        <button class="btn btn-warning btn-sm" onclick="mostrarFormularioEdicionEmpresa(${empresa.id})">Editar</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <button class="btn btn-light mt-3" onclick="menu()">Menú Principal</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al obtener empresas:", error);
            alert("Error al obtener la lista de empresas.");
        });
}

// Función para mostrar el formulario de edición con los datos de la empresa
function mostrarFormularioEdicionEmpresa(idEmpresa) {
    axios.get(`http://localhost:3000/empresas/${idEmpresa}`)
        .then(response => {
            const empresa = response.data;
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary text-center mb-3">Editar Empresa</h2>
                    <form id="formEditarEmpresa">
                        <div class="mb-3">
                            <label for="nombre_empresa" class="form-label">Nombre de la Empresa:</label>
                            <input type="text" id="nombre_empresa" class="form-control" value="${empresa.nombre_empresa}" required>
                        </div>
                        <div class="mb-3">
                            <label for="estado_empresa" class="form-label">Estado:</label>
                            <input type="text" id="estado_empresa" class="form-control" value="${empresa.estado}" required>
                        </div>
                        <div class="mb-3">
                            <label for="direccion_empresa" class="form-label">Dirección:</label>
                            <input type="text" id="direccion_empresa" class="form-control" value="${empresa.direccion_empresa}" required>
                        </div>
                        <div class="mb-3">
                            <label for="telefono_empresa" class="form-label">Teléfono:</label>
                            <input type="text" id="telefono_empresa" class="form-control" value="${empresa.telefono_empresa}" required>
                        </div>
                        <div class="mb-3">
                            <label for="email_empresa" class="form-label">Correo Electrónico:</label>
                            <input type="email" id="email_empresa" class="form-control" value="${empresa.email_empresa}" required>
                        </div>
                        <div class="mb-3">
                            <label for="sector_empresa" class="form-label">Sector:</label>
                            <input type="text" id="sector_empresa" class="form-control" value="${empresa.sector_empresa}" required>
                        </div>
                        <div class="mb-3">
                            <label for="tipo_empresa" class="form-label">Tipo de Empresa:</label>
                            <select id="tipo_empresa" class="form-control" required>
                                <option value="Pequeña" ${empresa.tipo_empresa === 'Pequeña' ? 'selected' : ''}>Pequeña</option>
                                <option value="Mediana" ${empresa.tipo_empresa === 'Mediana' ? 'selected' : ''}>Mediana</option>
                                <option value="Grande" ${empresa.tipo_empresa === 'Grande' ? 'selected' : ''}>Grande</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="fecha_creacion" class="form-label">Fecha de Creación:</label>
                            <input type="date" id="fecha_creacion" class="form-control" value="${empresa.fecha_creacion}" required>
                        </div>
                        <div class="mb-3">
                            <label for="sitio_web" class="form-label">Sitio Web:</label>
                            <input type="text" id="sitio_web" class="form-control" value="${empresa.sitio_web}">
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-success">Guardar Cambios</button>
                            <button onclick="editarEmpresas()" type="button" class="btn btn-light">Volver</button>
                        </div>
                    </form>
                </div>
            `;

            // Evento para manejar la edición de la empresa
            document.getElementById("formEditarEmpresa").addEventListener("submit", function (event) {
                event.preventDefault();

                const empresaEditada = {
                    nombre_empresa: document.getElementById("nombre_empresa").value,
                    estado: document.getElementById("estado_empresa").value,
                    direccion_empresa: document.getElementById("direccion_empresa").value,
                    telefono_empresa: document.getElementById("telefono_empresa").value,
                    email_empresa: document.getElementById("email_empresa").value,
                    sector_empresa: document.getElementById("sector_empresa").value,
                    tipo_empresa: document.getElementById("tipo_empresa").value,
                    fecha_creacion: document.getElementById("fecha_creacion").value,
                    sitio_web: document.getElementById("sitio_web").value
                };

                axios.put(`http://localhost:3000/empresas/editar/${idEmpresa}`, empresaEditada)
                    .then(response => {
                        alert("Empresa actualizada correctamente.");
                        editarEmpresas(); // Vuelve a cargar la lista de empresas
                    })
                    .catch(error => {
                        console.error("Error al actualizar la empresa:", error);
                        alert("Error al actualizar la empresa. Revisa la consola.");
                    });
            });
        })
        .catch(error => {
            console.error("Error al obtener los datos de la empresa:", error);
            alert("Error al obtener los datos de la empresa. Revisa la consola.");
        });
}

// Función para obtener los contactos y mostrarlos
function editarContactos() {
    axios.get("http://localhost:3000/contactos")
        .then(response => {
            const contactos = response.data;  // Los contactos que nos devuelve el servidor
            let listaContactos = "<ul class='list-group'>";

            // Mostrar los contactos en una lista con un botón de editar
            contactos.forEach(contacto => {
                listaContactos += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${contacto.nombre} - ${contacto.cargo_contacto}
                        <button class="btn btn-primary btn-sm" onclick="mostrarFormularioEdicion(${contacto.id})">Editar</button>
                    </li>
                `;
            });

            listaContactos += "</ul>";
            // Mostrar la lista en el HTML
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3">Contactos</h2>
                    ${listaContactos}
                    <button class="btn btn-light mt-3" onclick="menu()">Volver al Menú</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al obtener los contactos:", error);
        });
}

// Función para mostrar el formulario de edición
function mostrarFormularioEdicion(contactoId) {
    // Obtener el contacto desde el backend con el ID
    axios.get(`http://localhost:3000/contactos/${contactoId}`)
        .then(response => {
            const contacto = response.data;  // El contacto con el id correspondiente

            // Mostrar el formulario con los datos del contacto
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3">Editar Contacto</h2>
                    <form id="formEditarContacto">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre:</label>
                            <input type="text" id="nombre" class="form-control" value="${contacto.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label for="cargo_contacto" class="form-label">Cargo:</label>
                            <input type="text" id="cargo_contacto" class="form-control" value="${contacto.cargo_contacto}">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" id="email" class="form-control" value="${contacto.email}">
                        </div>
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Teléfono:</label>
                            <input type="text" id="telefono" class="form-control" value="${contacto.telefono}">
                        </div>
                        <div class="mb-3">
                            <label for="direccion_oficina" class="form-label">Dirección de Oficina:</label>
                            <input type="text" id="direccion_oficina" class="form-control" value="${contacto.direccion_oficina}">
                        </div>
                        <div class="mb-3">
                            <label for="horario_trabajo" class="form-label">Horario de Trabajo:</label>
                            <input type="text" id="horario_trabajo" class="form-control" value="${contacto.horario_trabajo}">
                        </div>
                        <div class="mb-3">
                            <label for="nivel_acceso" class="form-label">Nivel de Acceso:</label>
                            <select id="nivel_acceso" class="form-control">
                                <option value="Acceso Total" ${contacto.nivel_acceso === "Acceso Total" ? "selected" : ""}>Acceso Total</option>
                                <option value="Acceso Limitado" ${contacto.nivel_acceso === "Acceso Limitado" ? "selected" : ""}>Acceso Limitado</option>
                                <option value="Administrador de Personal" ${contacto.nivel_acceso === "Administrador de Personal" ? "selected" : ""}>Administrador de Personal</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="estado" class="form-label">Estado:</label>
                            <select id="estado" class="form-control">
                                <option value="Activo" ${contacto.estado === "Activo" ? "selected" : ""}>Activo</option>
                                <option value="Inactivo" ${contacto.estado === "Inactivo" ? "selected" : ""}>Inactivo</option>
                                <option value="En Licencia" ${contacto.estado === "En Licencia" ? "selected" : ""}>En Licencia</option>
                                <option value="Baja" ${contacto.estado === "Baja" ? "selected" : ""}>Baja</option>
                            </select>
                        </div>

                        <div class="d-flex justify-content-between">
                            <button type="submit" class="btn btn-success">Guardar Cambios</button>
                            <button onclick="menu()" type="button" class="btn btn-light">Volver al Menú</button>
                        </div>
                    </form>
                </div>
            `;

            // Manejar el envío del formulario para actualizar los datos
            document.getElementById("formEditarContacto").addEventListener("submit", function (event) {
                event.preventDefault();

                const contactoActualizado = {
                    nombre: document.getElementById("nombre").value,
                    cargo_contacto: document.getElementById("cargo_contacto").value,
                    email: document.getElementById("email").value,
                    telefono: document.getElementById("telefono").value,
                    direccion_oficina: document.getElementById("direccion_oficina").value,
                    horario_trabajo: document.getElementById("horario_trabajo").value,
                    nivel_acceso: document.getElementById("nivel_acceso").value,
                    estado: document.getElementById("estado").value,
                };

                // Enviar la actualización al backend
                axios.put(`http://localhost:3000/contactos/editar/${contactoId}`, contactoActualizado)
                    .then(response => {
                        alert("Contacto actualizado correctamente.");
                        obtenerContactos();  // Recargar la lista de contactos
                    })
                    .catch(error => {
                        console.error("Error al actualizar contacto:", error);
                        alert("Error al actualizar contacto.");
                    });
            });
        })
        .catch(error => {
            console.error("Error al obtener el contacto:", error);
        });
}



