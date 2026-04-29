document.addEventListener("DOMContentLoaded", () => {

    let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];
    let editIndex = null;

    function guardar() {
        localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    }

    // ==================== NAVEGACIÓN ====================
    window.mostrar = function(id) {
        document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
        const seccion = document.getElementById(id);
        if (seccion) seccion.style.display = "block";
    }

    window.mostrarListado = function() {
        mostrar("listado");
        cargarUltimo();
    }

    // ==================== GUARDAR VEHÍCULO (CORREGIDO) ====================
    const formVehiculo = document.getElementById("formVehiculo");
    if (formVehiculo) {
        formVehiculo.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const v = {
                codigo: this.codigo.value.trim(),
                placa: this.placa.value.trim().toUpperCase(),
                marca: this.marca.value.trim(),
                modelo: this.modelo.value.trim(),
                motor: this.motor.value.trim()
            };

            if (!v.codigo || !v.placa || !v.marca) {
                alert("Por favor completa los campos obligatorios:\n- Código\n- Placa\n- Marca");
                return;
            }

            if (editIndex !== null) {
                vehiculos[editIndex] = v;
                editIndex = null;
            } else {
                vehiculos.push(v);
            }

            guardar();
            this.reset();
            mostrarListado();   // Muestra el último vehículo registrado
        });
    }

    // ==================== GENERAR FILA DE TABLA ====================
    function filaHTML(v, index) {
        return `
            <tr>
                <td>${v.codigo}</td>
                <td>${v.placa}</td>
                <td>${v.marca}</td>
                <td>${v.modelo || '-'}</td>
                <td>${v.motor || '-'}</td>
                <td style="text-align: center; white-space: nowrap;">
                    <button class="btn-editar" onclick="editar(${index})" title="Editar">✏️</button>
                    <button class="btn-eliminar" onclick="eliminar(${index})" title="Eliminar">🗑</button>
                </td>
            </tr>
        `;
    }

    // ==================== CARGAR ÚLTIMO VEHÍCULO ====================
    function cargarUltimo() {
        const tabla = document.getElementById("tablaVehiculos");
        tabla.innerHTML = "";

        if (vehiculos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#aaa;">No hay vehículos registrados aún</td></tr>`;
            return;
        }

        const ultimo = vehiculos[vehiculos.length - 1];
        tabla.innerHTML = filaHTML(ultimo, vehiculos.length - 1);
    }

    // ==================== VER TODOS ====================
    window.verTodos = function() {
        const tabla = document.getElementById("tablaVehiculos");
        tabla.innerHTML = "";

        if (vehiculos.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#aaa;">No hay vehículos registrados</td></tr>`;
            return;
        }

        vehiculos.forEach((v, i) => {
            tabla.innerHTML += filaHTML(v, i);
        });
    }

    // ==================== EDITAR Y ELIMINAR ====================
    window.editar = function(index) {
        const v = vehiculos[index];
        const form = document.getElementById("formVehiculo");

        form.codigo.value = v.codigo;
        form.placa.value = v.placa;
        form.marca.value = v.marca;
        form.modelo.value = v.modelo || "";
        form.motor.value = v.motor || "";

        editIndex = index;
        mostrar("vehiculo");
    }

    window.eliminar = function(index) {
        if (confirm("¿Estás seguro de eliminar este vehículo?")) {
            vehiculos.splice(index, 1);
            guardar();
            verTodos();
        }
    }

    // ==================== BUSCADOR ====================
    window.buscarVehiculo = function() {
        const txt = document.getElementById("buscador").value.toLowerCase().trim();
        const tabla = document.getElementById("tablaVehiculos");

        if (!txt) {
            verTodos();
            return;
        }

        tabla.innerHTML = "";

        const filtrados = vehiculos.filter(v => 
            v.codigo.toLowerCase().includes(txt) ||
            v.placa.toLowerCase().includes(txt) ||
            v.marca.toLowerCase().includes(txt)
        );

        if (filtrados.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#aaa;">No se encontraron resultados</td></tr>`;
            return;
        }

        filtrados.forEach((v, i) => {
            tabla.innerHTML += filaHTML(v, vehiculos.indexOf(v));
        });
    }

    // ==================== LOGIN ====================
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", e => {
            e.preventDefault();
            mostrarListado();
        });
    }

});