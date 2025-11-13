let habitos = [];

// Cargar hábitos del localStorage
function cargarHabitos() {
  let guardados = localStorage.getItem("cardHabitos");
  if (guardados) {
    guardados = JSON.parse(guardados);
    guardados.forEach(function (habito) {
      habito.fechasRealizadas = habito.fechasRealizadas.map(function (fecha) {
        return new Date(fecha);
      });
      habitos.push(habito);
    });
  }
}

// Guardar hábitos en localStorage
function guardarHabitos() {
  localStorage.setItem("cardHabitos", JSON.stringify(habitos));
}

// Crear un nuevo hábito
function agregarHabito(nombre) {
  const nuevo = {
    id: Date.now(),
    nombre: nombre,
    fechasRealizadas: [],
  };
  habitos.push(nuevo);
  guardarHabitos();
}

// Registrar un avance
async function marcarComoRealizado(habito) {
  const { value: fechaElegida } = await Swal.fire({
    title: "Registrar Avance",
    input: "datetime-local",
    inputLabel: "Elegí la fecha y hora del avance",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
  });

  if (fechaElegida) {
    const fecha = new Date(fechaElegida);
    habito.fechasRealizadas.push(fecha);
    guardarHabitos();
    Swal.fire({
      title: "¡Registrado!",
      text: "El avance fue agregado correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

// Editar un hábito existente
function editarHabitoNombre(habitoId, nuevoNombre) {
  const habito = habitos.find(function (h) {
    return h.id == habitoId;
  });
  if (habito) {
    habito.nombre = nuevoNombre.trim();
    guardarHabitos();
  }
}

// Eliminar hábito
function eliminarHabito(habitoId) {
  const index = habitos.findIndex(function (h) {
    return h.id == habitoId;
  });
  if (index !== -1) {
    habitos.splice(index, 1);
    guardarHabitos();
  }
}
