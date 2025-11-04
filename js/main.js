let habitosContainer = document.getElementById("habitos-container");

let habitos = [];
let cartStorage = localStorage.getItem("cardHabitos");
if (cartStorage) {
  cartStorage = JSON.parse(cartStorage);
  cartStorage.forEach((habito) => {
    habito.fechasRealizadas = habito.fechasRealizadas.map(
      (fecha) => new Date(fecha)
    );

    habitos.push(habito);
  });
}

renderHabitos(habitos);

function marcarComoRealizado(habito) {
  const hoy = new Date();
  habito.fechasRealizadas.push(hoy);
  console.log(habito);
  localStorage.setItem("cardHabitos", JSON.stringify(habitos));
}

function eliminarHabito(habitoId) {
  const index = habitos.findIndex((habito) => habito.id == habitoId);
  if (index !== -1) {
    habitos.splice(index, 1);
    localStorage.setItem("cardHabitos", JSON.stringify(habitos));
    renderHabitos(habitos);
  }
}

async function editarHabito(habitoId) {
  const habito = habitos.find((h) => h.id == habitoId);
  if (habito) {
    const { value: nuevoNombre } = await Swal.fire({
      title: "Modificar Hábito",
      input: "text",
      inputLabel: "Nuevo nombre del hábito",
      inputValue: habito.nombre,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Por favor ingresa un nombre para el hábito";
        }
      },
    });

    if (nuevoNombre && nuevoNombre.trim() !== "") {
      habito.nombre = nuevoNombre.trim();
      localStorage.setItem("cardHabitos", JSON.stringify(habitos));
      renderHabitos(habitos);

      Swal.fire({
        title: "¡Actualizado!",
        text: "El hábito ha sido modificado exitosamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
}

function renderHabitos(habitosArray) {
  habitosContainer.innerHTML = "";
  habitosArray.forEach((habito) => {
    const card = document.createElement("div");
    const listaFechas = document.createElement("ul");
    if (habito.fechasRealizadas.length > 0) {
      habito.fechasRealizadas.forEach((fecha) => {
        const item = document.createElement("li");
        item.textContent = new Date(fecha).toLocaleDateString();
        listaFechas.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "Sin avance";
      listaFechas.appendChild(item);
    }

    card.innerHTML = `<h3>${habito.nombre}</h3>
                    <button class="habitoRegistrar" data-id="${habito.id}">Registrar avance</button>
                    <button class="habitoEditar" data-id="${habito.id}">✏️</button>
                    <button class="habitoEliminar" data-id="${habito.id}">🗑️</button>`;
    card.appendChild(listaFechas);
    habitosContainer.appendChild(card);
  });
  addToCardButton();
}
function addToCardButton() {
  // Botones de registrar avance para todas las cards
  const registrarButtons = document.querySelectorAll(".habitoRegistrar");
  registrarButtons.forEach((button) => {
    button.onclick = (e) => {
      const habitoId = e.currentTarget.dataset.id;
      const habitoSeleccionado = habitos.find(
        (habito) => habito.id == habitoId
      );
      marcarComoRealizado(habitoSeleccionado);
      renderHabitos(habitos);
    };
  });

  // Botones de editar para cards
  const editarButtons = document.querySelectorAll(".habitoEditar");
  editarButtons.forEach((button) => {
    button.onclick = (e) => {
      const habitoId = e.currentTarget.dataset.id;
      editarHabito(habitoId);
    };
  });

  // Botones de eliminar una cadrs
  const eliminarButtons = document.querySelectorAll(".habitoEliminar");
  eliminarButtons.forEach((button) => {
    button.onclick = (e) => {
      const habitoId = e.currentTarget.dataset.id;
      Swal.fire({
        title: "Eliminar hábito",
        text: "¿Estás seguro de eliminar este hábito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borralo!",
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarHabito(habitoId);
          Swal.fire({
            title: "Borrado!",
            text: "Su hábito a sido eliminado",
            icon: "success",
          });
        }
      });
    };
  });
}
const agregarHabito = document.getElementById("nuevoHabito");
agregarHabito.onclick = async () => {
  const { value: nombreHabito } = await Swal.fire({
    title: "Nuevo Hábito",
    input: "text",
    inputLabel: "Nombre del hábito",
    inputPlaceholder: "Ej: Hacer ejercicio, Leer, Meditar...",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value || value.trim() === "") {
        return "Por favor ingresa un nombre para el hábito";
      }
      // Verificar si el hábito ya existe --
      const existe = habitos.some(
        (habito) => habito.nombre.toLowerCase() === value.toLowerCase()
      );
      if (existe) {
        return "Ese hábito ya existe!";
      }
    },
  });

  if (nombreHabito && nombreHabito.trim() !== "") {
    const nuevoHabito = {
      id: Date.now(),
      nombre: nombreHabito.trim(),
      fechasRealizadas: [],
    };

    habitos.push(nuevoHabito);
    localStorage.setItem("cardHabitos", JSON.stringify(habitos));
    renderHabitos(habitos);

    Swal.fire({
      title: "¡Creado!",
      text: `El hábito "${nombreHabito}" ha sido agregado exitosamente`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};
