document.addEventListener("DOMContentLoaded", () => {
  const botonesComprar = document.querySelectorAll(".product button");
  const contador = document.getElementById("contador-carrito");
  const carritoIcono = document.getElementById("carrito-icono");
  const modal = document.getElementById("modal-carrito");
  const cerrarModal = document.querySelector(".cerrar");
  const listaCarrito = document.getElementById("lista-carrito");
  const btnFinalizar = document.getElementById("finalizar-compra");
  const toast = document.getElementById("toast");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  actualizarContador();
  mostrarProductos();

  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.parentElement.querySelector("h3").textContent;
      const precioTexto = boton.parentElement.querySelector("p").textContent;
      const precio = parseInt(precioTexto.replace(/\D/g, ""));

      const productoExistente = carrito.find(p => p.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));

      actualizarContador();
      mostrarProductos();
      mostrarToast(`🛒 "${nombre}" agregado al carrito`);
    });
  });

  carritoIcono.addEventListener("click", () => {
    mostrarProductos();
    modal.style.display = "block";
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("🛒 Tu carrito está vacío.");
      return;
    }

    const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    alert(`✅ Gracias por tu compra.\nTotal: $${total.toLocaleString()} COP\nRecibirás confirmación por correo.`);

    carrito = [];
    localStorage.removeItem("carrito");
    actualizarContador();
    mostrarProductos();
    modal.style.display = "none";
  });

  function actualizarContador() {
    const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    contador.textContent = totalItems;
  }

  function mostrarProductos() {
    listaCarrito.innerHTML = "";
    if (carrito.length === 0) {
      listaCarrito.innerHTML = "<li>Tu carrito está vacío.</li>";
    } else {
      carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toLocaleString()} COP`;
        listaCarrito.appendChild(li);
      });
    }
  }

  function mostrarToast(mensaje = "Producto agregado al carrito 🛒") {
    toast.textContent = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
});
