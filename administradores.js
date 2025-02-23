var cuerpo = document.getElementById("cuerpo");
var acreditacion;

// Para mantener la sesión iniciada
function menu() {
    // Solicitar el login a la ruta de administradores
    axios.post("http://localhost:3000/administradores/login", acreditacion)
        .then(response => {
            // Si la autenticación es correcta, obtienes los datos del administrador
            let email = response.data.email;
            console.log("Administrador logueado:", email);

            // Insertar botones en el contenedor "cuerpo" con las opciones correspondientes
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white text-center">
                    <h2 class="text-primary mb-3">Opciones</h2>
                    <button class="btn btn-success m-2" onclick="insertarProfesores()">Insertar Profesores</button>
                    <button class="btn btn-success m-2" onclick="editarProfesores()">Ver Profesores</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error en el login:", error);
            alert("Error en el login. Verifica tus credenciales.");
        });
}

// Para recoger los datos para el login
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    acreditacion = {
        email: email,
        password: password
    };
    menu();  // Llama a la función menu para mostrar las opciones después del login
}

// solo el formulario
function insertarProfesores() {
    cuerpo.innerHTML = `
        <div class="container mt-4 p-4 border rounded shadow bg-white">
            <h2 class="text-primary mb-3 text-center">Insertar Profesor</h2>
            <form id="formInsertarProfesor">
                <div class="mb-3">
                    <label class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" required>
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
                    <label class="form-label">Dirección:</label>
                    <textarea class="form-control" id="direccion"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Fecha de Nacimiento:</label>
                    <input type="date" class="form-control" id="fecha_nacimiento">
                </div>
                <div class="mb-3">
                    <label class="form-label">Género:</label>
                    <select class="form-control" id="genero">
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Rol:</label>
                    <select class="form-control" id="rol">
                        <option value="Profesor">Profesor</option>
                        <option value="Coordinador">Coordinador</option>
                        <option value="Jefe de Departamento">Jefe de Departamento</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Departamento:</label>
                    <select class="form-control" id="departamento">
                        <option value="informatica">Informática</option>
                        <option value="jardineria">Jardinería</option>
                        <option value="administracion">Administración</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Tipo de Contrato:</label>
                    <select class="form-control" id="tipo_contrato">
                        <option value="tiempo_completo">Tiempo Completo</option>
                        <option value="medio_tiempo">Medio Tiempo</option>
                        <option value="sustituto">Sustituto</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Fecha de Ingreso:</label>
                    <input type="date" class="form-control" id="fecha_ingreso">
                </div>
                <div class="mb-3">
                    <label class="form-label">Estado:</label>
                    <select class="form-control" id="estado">
                        <option value="activo">Activo</option>
                        <option value="en_licencia">En Licencia</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Contraseña:</label>
                    <input type="password" class="form-control" id="contrasena" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Centro:</label>
                    <select class="form-control" id="centro">
                        <option value="escuela_secundaria_a">Escuela Secundaria A</option>
                        <option value="colegio_abc">Colegio ABC</option>
                    </select>
                </div>
                <button type="button" class="btn btn-primary" onclick="guardarProfesor()">Guardar Profesor</button>
                <button type="button" class="btn btn-secondary" onclick="menu()">Volver</button>
            </form>
        </div>
    `;
}

// Toma los valores del formulario y conecto con axios
function guardarProfesor() {
    let profesor = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        genero: document.getElementById("genero").value,
        rol: document.getElementById("rol").value,
        departamento: document.getElementById("departamento").value,
        tipo_contrato: document.getElementById("tipo_contrato").value,
        fecha_ingreso: document.getElementById("fecha_ingreso").value,
        estado: document.getElementById("estado").value,
        contrasena: document.getElementById("contrasena").value,
        centro: document.getElementById("centro").value
    };

    axios.post("http://localhost:3000/profesores", profesor)
        .then(response => {
            alert("Profesor insertado correctamente");
            menu();
        })
        .catch(error => {
            console.error("Error al insertar profesor:", error);
            alert("Hubo un error al insertar el profesor");
        });
}

// mostramos todos los profesores
function editarProfesores() {
    axios.get("http://localhost:3000/profesores")
        .then(response => {
            let profesores = response.data;
            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3 text-center">Editar Profesores</h2>
                    <ul class="list-group">
                        ${profesores.map(prof => `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                ${prof.nombre}
                                <button class="btn btn-warning btn-sm" onclick="mostrarFormularioEdicion(${prof.id})">Editar</button>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn btn-secondary mt-3" onclick="menu()">Volver</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al obtener profesores:", error);
            alert("Error al obtener la lista de profesores.");
        });
}

//cargamos los datos del profesor seleccionado por id
function mostrarFormularioEdicion(id) {
    axios.get(`http://localhost:3000/profesores/${id}`)
        .then(response => {
            let prof = response.data;

            cuerpo.innerHTML = `
                <div class="container mt-4 p-4 border rounded shadow bg-white">
                    <h2 class="text-primary mb-3 text-center">Editar Profesor</h2>
                    <form id="formEditarProfesor">
                        <div class="mb-3">
                            <label class="form-label">Nombre:</label>
                            <input type="text" class="form-control" id="nombre" value="${prof.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email:</label>
                            <input type="email" class="form-control" id="email" value="${prof.email}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Teléfono:</label>
                            <input type="text" class="form-control" id="telefono" value="${prof.telefono || ''}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Dirección:</label>
                            <textarea class="form-control" id="direccion">${prof.direccion || ''}</textarea>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="actualizarProfesor(${prof.id})">Guardar Cambios</button>
                        <button type="button" class="btn btn-secondary" onclick="editarProfesores()">Cancelar</button>
                    </form>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al obtener datos del profesor:", error);
            alert("Error al cargar los datos del profesor.");
        });
}

//actualizamos el profesor seleccionado por id
function actualizarProfesor(id) {
    let profesorActualizado = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value
    };

    axios.post(`http://localhost:3000/profesores/${id}`, profesorActualizado)
        .then(response => {
            alert("Profesor actualizado correctamente");
            editarProfesores();
        })
        .catch(error => {
            console.error("Error al actualizar profesor:", error);
            alert("Error al actualizar el profesor.");
        });
}


