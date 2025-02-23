const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

//TUTORES
// Login para tutores
app.post('/tutores/login', (req, res) => { 
    const { email, password } = req.body;

    const sql = `SELECT cursos.id as id_curso FROM cursos INNER JOIN profesores ON profesores.id = cursos.tutor_id WHERE profesores.email = ? AND profesores.contrasena = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Error al ejecutar la consulta SQL:", err); // Log para ver el error exacto
            return res.status(500).json({ success: false, message: "Error en el servidor", error: err.message });
        }

        if (results.length > 0) {
            res.json({ success: true, message: "Login exitoso", id_curso: results[0].id_curso });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

// Obtener alumnos por curso
app.get('/alumnos/:id_curso', (req, res) => {
    const curso = req.params.id_curso;
    db.query(
        'SELECT id, nombre, email, telefono, direccion, DATE(fecha_nacimiento) as fecha_nacimiento, genero, DATE(fecha_ingreso) as fecha_ingreso FROM alumnos WHERE curso_id = ?',
        [curso], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

// Obtener prácticas por alumno
app.get('/practicas/:id_alumno', (req, res) => {
    const id = req.params.id_alumno;
    db.query('SELECT * FROM practicas WHERE id_alumno = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontraron prácticas para este alumno" });
        }

        res.json(results);
    });
});

// Actualizar prácticas
app.put('/practicas/update', (req, res) => {
    console.log('Datos recibidos:', req.body); 
    const { id_alumno, nombre, fase, estado, tutor, fecha_inicio, fecha_fin, modalidad, lugar, empresa } = req.body;

    // Consulta SQL de actualización
    const sql = `UPDATE practicas SET 
                 alumno = ?, fase = ?, estado = ?, tutor = ?, 
                 fecha_inicio = ?, fecha_fin = ?, modalidad = ?, 
                 lugar = ?, empresa = ? 
                 WHERE id_alumno = ?`;


    db.query(sql, [nombre, fase, estado, tutor, fecha_inicio, fecha_fin, modalidad, lugar, empresa, id_alumno], (err, results) => {
        if (err) {
            console.error('Error de consulta SQL:', err.message);  // Log de error detallado
            return res.status(500).json({ error: 'Error al actualizar la práctica', details: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Alumno no encontrado' });
        }

        res.json({ message: 'Práctica actualizada exitosamente' });
    });
});

//actualizar fase para todo el curos
app.put("/practicas/asignarFase", (req, res) => {
    const { id_curso } = req.body;

    if (!id_curso) {
        return res.status(400).json({ error: "Falta el ID del curso." });
    }

    // Consulta corregida: usamos `id_alumno` en lugar de `nombre`
    const sql = `
        UPDATE practicas 
        SET fase = 'pendiente_asignacion' 
        WHERE id_alumno IN (
            SELECT id FROM alumnos WHERE curso_id = ?
        )
    `;

    db.query(sql, [id_curso], (err, result) => {
        if (err) {
            console.error("Error al actualizar la fase:", err);
            return res.status(500).json({ error: "Error al actualizar la fase." });
        }

        if (result.affectedRows > 0) {
            res.json({ message: `Se ha asignado la fase 'pendiente_asignacion' a ${result.affectedRows} alumnos.` });
        } else {
            res.status(404).json({ message: "No se encontraron alumnos para este curso." });
        }
    });
});

//guardar contacto de empresa
app.post("/contactos", (req, res) => {
    const { nombre, cargo_contacto, departamento, email, telefono, empresa_id } = req.body;

    if (!nombre || !email || !empresa_id) {
        return res.status(400).json({ error: "Nombre, email e ID de empresa son obligatorios." });
    }

    const sql = `
        INSERT INTO contactos_empresa (nombre, cargo_contacto, departamento, email, telefono, empresa_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre, cargo_contacto, departamento, email, telefono, empresa_id], (err, result) => {
        if (err) {
            console.error("Error al insertar el contacto:", err);
            return res.status(500).json({ error: "Error al insertar el contacto." });
        }

        res.json({ message: "Contacto insertado correctamente", id: result.insertId });
    });
});

//guardar empresa
app.post("/empresas/insertar", (req, res) => {
    const { nombre_empresa, direccion_empresa, telefono_empresa, email_empresa, sector_empresa, tipo_empresa } = req.body;

    const sql = "INSERT INTO empresas (nombre_empresa, direccion_empresa, telefono_empresa, email_empresa, sector_empresa, tipo_empresa) VALUES (?, ?, ?, ?, ?, ?)";
    const valores = [nombre_empresa, direccion_empresa, telefono_empresa, email_empresa, sector_empresa, tipo_empresa];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error("Error al insertar empresa:", err);
            res.status(500).json({ mensaje: "Error al insertar empresa" });
        } else {
            res.status(201).json({ mensaje: "Empresa insertada correctamente", id: result.insertId });
        }
    });
});

//PROFESORES
// Ruta para el login de profesores
app.post("/profesores/login", (req, res) => {
    const { email, password } = req.body;
    //esta linea es solo para diagnostico
    console.log("Datos recibidos para login de profesor:", { email, password }); 

    const sql = "SELECT * FROM profesores WHERE email = ? AND contrasena = ?";

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }

        if (results.length > 0) {
            res.status(200).json(results[0]); // Retorna el profesor autenticado
        } else {
            res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }
    });
});

// Ruta para insertar un alumno
app.post("/alumnos/insertar", (req, res) => {
    const { nombre, email, telefono, direccion, fecha_nacimiento, curso, genero } = req.body;

    const sql = `INSERT INTO alumnos (nombre, email, telefono, direccion, fecha_nacimiento, curso, genero) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const valores = [nombre, email, telefono, direccion, fecha_nacimiento, curso, genero];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error("Error al insertar alumno:", err);
            res.status(500).json({ mensaje: "Error al insertar alumno" });
        } else {
            res.status(201).json({ mensaje: "Alumno insertado correctamente", id: result.insertId });
        }
    });
});

//obtener todos los alumnos
app.get("/alumnos", (req, res) => {
    const sql = `
        SELECT 
            alumnos.id, 
            alumnos.nombre, 
            cursos.nombre_curso 
        FROM alumnos 
        INNER JOIN cursos ON alumnos.curso_id = cursos.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener alumnos:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.json(results);
    });
});

// Obtener un alumno por su ID
app.get('/alumnos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id, nombre, curso FROM alumnos WHERE id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener el alumno:", err);
            return res.status(500).json({ mensaje: "Error al obtener el alumno" });
        }
        if (results.length > 0) {
            res.json(results[0]); // Retorna el alumno con el ID solicitado
        } else {
            res.status(404).json({ mensaje: "Alumno no encontrado" });
        }
    });
});

// Editar un alumno
app.put("/alumnos/editar/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, curso } = req.body;
    const sql = "UPDATE alumnos SET nombre = ?, curso = ? WHERE id = ?";
    
    db.query(sql, [nombre, curso, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar alumno:", err);
            return res.status(500).json({ mensaje: "Error al actualizar alumno" });
        }
        res.json({ mensaje: "Alumno actualizado correctamente" });
    });
});

// Obtener todas las empresas
app.get("/empresas", (req, res) => {
    const sql = "SELECT * FROM empresas";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener empresas:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.json(results);
    });
});

// Obtener una empresa por su ID
app.get("/empresas/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM empresas WHERE id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener empresa:", err);
            return res.status(500).json({ mensaje: "Error al obtener empresa" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ mensaje: "Empresa no encontrada" });
        }
    });
});

// Editar una empresa
app.put("/empresas/editar/:id", (req, res) => {
    const id = req.params.id;
    const { nombre_empresa, direccion_empresa, telefono_empresa, email_empresa, sector_empresa, tipo_empresa, fecha_creacion, sitio_web } = req.body;
    const sql = "UPDATE empresas SET nombre_empresa = ?, direccion_empresa = ?, telefono_empresa = ?, email_empresa = ?, sector_empresa = ?, tipo_empresa = ?, fecha_creacion = ?, sitio_web = ? WHERE id = ?";
    
    db.query(sql, [nombre_empresa, direccion_empresa, telefono_empresa, email_empresa, sector_empresa, tipo_empresa, fecha_creacion, sitio_web, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar empresa:", err);
            return res.status(500).json({ mensaje: "Error al actualizar empresa" });
        }
        res.json({ mensaje: "Empresa actualizada correctamente" });
    });
});

//obtener contactos de empresa
app.get("/contactos", (req, res) => {
    const sql = "SELECT * FROM contactos_empresa";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener contactos:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.json(results);  // Retorna los contactos
    });
});


// Obtener un contacto por su ID
app.get("/contactos/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM contactos_empresa WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener contacto:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.json(results[0]);
    });
});

// Editar un contacto
app.put("/contactos/editar/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, cargo_contacto, email, telefono, direccion_oficina, horario_trabajo, nivel_acceso, estado } = req.body;

    const sql = `
        UPDATE contactos_empresa 
        SET nombre = ?, cargo_contacto = ?, email = ?, telefono = ?, direccion_oficina = ?, horario_trabajo = ?, nivel_acceso = ?, estado = ?
        WHERE id = ?`;

    db.query(sql, [nombre, cargo_contacto, email, telefono, direccion_oficina, horario_trabajo, nivel_acceso, estado, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar contacto:", err);
            return res.status(500).json({ mensaje: "Error al actualizar contacto" });
        }
        res.json({ mensaje: "Contacto actualizado correctamente" });
    });
});

//ADMINISTRADORES
// Ruta de login para administradores
app.post("/administradores/login", (req, res) => {
    const { email, password } = req.body;

    // Mostrar los datos recibidos para diagnóstico
    console.log("Datos recibidos para login de administrador:", { email, password });

    // Consulta a la base de datos
    const sql = "SELECT * FROM administradores WHERE email = ? AND contrasena = ?";

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }

        if (results.length > 0) {
            // Si las credenciales son correctas, devolver los datos del administrador
            res.status(200).json(results[0]); // Devolvemos el primer resultado que es el administrador autenticado
        } else {
            // Si no se encuentran credenciales, devolver error
            res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }
    });
});

//Ruta para insertar profesores
app.post("/profesores", (req, res) => {
    const {
        nombre, email, telefono, direccion, fecha_nacimiento, genero, rol, departamento,
        tipo_contrato, fecha_ingreso, estado, contrasena, centro
    } = req.body;

    const sql = `INSERT INTO profesores (nombre, email, telefono, direccion, fecha_nacimiento, genero, rol, departamento, 
                tipo_contrato, fecha_ingreso, estado, contrasena, centro) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, email, telefono, direccion, fecha_nacimiento, genero, rol, departamento,
        tipo_contrato, fecha_ingreso, estado, contrasena, centro], (err, result) => {
        
        if (err) {
            console.error("Error al insertar profesor:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }

        res.status(201).json({ mensaje: "Profesor insertado correctamente" });
    });
});

// Obtener todos los profesores (lista para editar)
app.get("/profesores", (req, res) => {
    const sql = "SELECT id, nombre FROM profesores";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener profesores:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.json(results);
    });
});

// Obtener un profesor por su ID
app.get("/profesores/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM profesores WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener profesor:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ mensaje: "Profesor no encontrado" });
        }
    });
});

// Actualizar profesor
app.post("/profesores/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;
    const sql = "UPDATE profesores SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?";

    db.query(sql, [nombre, email, telefono, direccion, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar profesor:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        res.status(200).json({ mensaje: "Profesor actualizado correctamente" });
    });
});


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
