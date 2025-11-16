let habitosContainer = document.getElementById("habitos-container");
let agregarHabitoBtn = document.getElementById("nuevoHabito");

// Inicializar
cargarHabitos();
renderHabitos(habitos);

// Renderizar todas las cards
function renderHabitos(habitosArray) {
  habitosContainer.innerHTML = "";
  habitosArray.forEach(function (habito) {
    const card = document.createElement("div");
    const listaFechas = document.createElement("ul");

    // 🔹 Calcular cantidad de avances del mes actual (una sola vez)
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();
    const avancesMes = habito.fechasRealizadas.filter(function (fecha) {
      const f = new Date(fecha);
      return f.getMonth() === mesActual && f.getFullYear() === anioActual;
    }).length;

    // 🔹 Renderizar fechas
    if (habito.fechasRealizadas.length > 0) {
      habito.fechasRealizadas.forEach(function (fecha) {
        const item = document.createElement("li");
        item.innerHTML =
          new Date(fecha).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          }) +
          " <button class='habitoEditarFecha'>✏️</button>" +
          "<button class='habitoEliminarFecha'>🗑️</button>";
        listaFechas.appendChild(item);
      });
    } else {
      const item = document.createElement("li");
      item.textContent = "Sin avance";
      listaFechas.appendChild(item);
    }

    // 🔹 Armar la card del hábito
    card.innerHTML =
      "<h3>" +
      habito.nombre +
      "</h3>" +
      "<p class='resumenMes'>Este mes avanzaste " +
      avancesMes +
      " veces este hábito</p>" +
      "<button class='habitoRegistrar' data-id='" +
      habito.id +
      "'>Registrar avance</button>" +
      "<button class='habitoEditar' data-id='" +
      habito.id +
      "'>✏️</button>" +
      "<button class='habitoEliminar' data-id='" +
      habito.id +
      "'>🗑️</button>";

    card.appendChild(listaFechas);
    habitosContainer.appendChild(card);
  });

  addToCardButton();
}

// Eventos para cada botón de lascards
function addToCardButton() {
  const registrarButtons = document.querySelectorAll(".habitoRegistrar");
  registrarButtons.forEach(function (button) {
    button.onclick = async function (e) {
      const habitoId = e.currentTarget.getAttribute("data-id");
      const habitoSeleccionado = habitos.find(function (h) {
        return h.id == habitoId;
      });
      await marcarComoRealizado(habitoSeleccionado);
      renderHabitos(habitos);
    };
  });

  const editarButtons = document.querySelectorAll(".habitoEditar");
  editarButtons.forEach(function (button) {
    button.onclick = async function (e) {
      const habitoId = e.currentTarget.getAttribute("data-id");
      const habito = habitos.find(function (h) {
        return h.id == habitoId;
      });

      const { value: nuevoNombre } = await Swal.fire({
        title: "Modificar Hábito",
        input: "text",
        inputLabel: "Nuevo nombre del hábito",
        inputValue: habito.nombre,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        inputValidator: function (value) {
          if (!value || value.trim() === "") {
            return "Por favor ingresa un nombre para el hábito";
          }
        },
      });

      if (nuevoNombre && nuevoNombre.trim() !== "") {
        editarHabitoNombre(habitoId, nuevoNombre);
        renderHabitos(habitos);
        Swal.fire({
          title: "¡Actualizado!",
          text: "El hábito ha sido modificado exitosamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    };
  });

  const eliminarButtons = document.querySelectorAll(".habitoEliminar");
  eliminarButtons.forEach(function (button) {
    button.onclick = function (e) {
      const habitoId = e.currentTarget.getAttribute("data-id");
      Swal.fire({
        title: "Eliminar hábito",
        text: "¿Estás seguro de eliminar este hábito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrarlo!",
      }).then(function (result) {
        if (result.isConfirmed) {
          eliminarHabito(habitoId);
          renderHabitos(habitos);
          Swal.fire({
            title: "Borrado!",
            text: "El hábito ha sido eliminado",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    };
  });
  const editarFechaBtns = document.querySelectorAll(".habitoEditarFecha");
  editarFechaBtns.forEach(function (btn) {
    btn.onclick = async function (e) {
      const li = e.target.closest("li");
      const fechaTexto = li.textContent.split("✏️")[0].trim();
      const habito = habitos.find((h) =>
        h.fechasRealizadas.some(
          (f) =>
            new Date(f).toLocaleString("es-AR", {
              dateStyle: "short",
              timeStyle: "short",
            }) === fechaTexto
        )
      );
      const index = habito.fechasRealizadas.findIndex(
        (f) =>
          new Date(f).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          }) === fechaTexto
      );

      const { value: nuevaFecha } = await Swal.fire({
        title: "Modificar fecha",
        input: "datetime-local",
        inputLabel: "Elegí la nueva fecha",
        showCancelButton: true,
      });

      if (nuevaFecha) {
        habito.fechasRealizadas[index] = new Date(nuevaFecha);
        guardarHabitos();
        renderHabitos(habitos);
      }
    };
  });

  const eliminarFechaBtns = document.querySelectorAll(".habitoEliminarFecha");
  eliminarFechaBtns.forEach(function (btn) {
    btn.onclick = function (e) {
      const li = e.target.closest("li");
      const fechaTexto = li.textContent.split("✏️")[0].trim();
      const habito = habitos.find((h) =>
        h.fechasRealizadas.some(
          (f) =>
            new Date(f).toLocaleString("es-AR", {
              dateStyle: "short",
              timeStyle: "short",
            }) === fechaTexto
        )
      );
      const index = habito.fechasRealizadas.findIndex(
        (f) =>
          new Date(f).toLocaleString("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          }) === fechaTexto
      );

      Swal.fire({
        title: "Eliminar fecha",
        text: "¿Seguro que querés eliminar este avance?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          habito.fechasRealizadas.splice(index, 1);
          guardarHabitos();
          renderHabitos(habitos);
        }
      });
    };
  });
}

// Botón para crear nuevo hábito
agregarHabitoBtn.onclick = async function () {
  const { value: nombreHabito } = await Swal.fire({
    title: "Nuevo Hábito",
    input: "text",
    inputLabel: "Nombre del hábito",
    inputPlaceholder: "Ej: Hacer ejercicio, Leer, Meditar...",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    inputValidator: function (value) {
      if (!value || value.trim() === "") {
        return "Por favor ingresa un nombre para el hábito";
      }
      const existe = habitos.some(function (h) {
        return h.nombre.toLowerCase() === value.toLowerCase();
      });
      if (existe) {
        return "Ese hábito ya existe!";
      }
    },
  });

  if (nombreHabito && nombreHabito.trim() !== "") {
    agregarHabito(nombreHabito.trim());
    renderHabitos(habitos);
    Swal.fire({
      title: "¡Creado!",
      text: 'El hábito "' + nombreHabito + '" ha sido agregado exitosamente',
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const btnSugeridos = document.getElementById("sugerirHabito");
const btnVolver = document.getElementById("verHabitos");
const titulo = document.querySelector(".header-section h2");
const contenedor = document.getElementById("habitos-container");

// Mostrar sugeridos
btnSugeridos.addEventListener("click", function () {
  titulo.textContent = "Hábitos sugeridos";
  btnVolver.style.display = "inline-flex"; // 👉 aparece

  fetch("./db/data.json")
    .then((res) => res.json())
    .then((data) => {
      contenedor.innerHTML = "";

      data.forEach(function (hab) {
        const card = document.createElement("div");
        card.className = "card-habito";
        card.innerHTML = `
          <h3>${hab.nombre}</h3>
          <p><strong>Descripción:</strong> ${hab.descripcion}</p>
          <p><strong>Beneficios:</strong> ${hab.beneficios}</p>
        `;
        contenedor.appendChild(card);
      });
    });
});

// Volver a la vista principal
btnVolver.addEventListener("click", function () {
  titulo.textContent = "Mis Hábitos";
  btnVolver.style.display = "none"; // 👉 desaparece
  renderHabitos(habitos);
});
