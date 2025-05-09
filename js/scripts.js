// scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://dolarapi.com/v1/dolares";
  const currenciesContainer = document.getElementById("dollar-grid");
  const mainCard = document.getElementById("main-card");
  const updateTimeElement = document.getElementById("update-time");

  // Modifica la función formatCurrency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 3600000);
    return diffMinutes < 1 ? "Ahora mismo" : `Hace ${diffMinutes} hs`;
  };

  // Crear elemento de tarjeta
  const createCurrencyCard = (currency, index) => {
    const currencyFlag =
      {
        USD: "🇺🇸",
        EUR: "🇪🇺",
        BRL: "🇧🇷",
        CLP: "🇨🇱",
        ARS: "AR",
      }[currency.moneda] || "💱";

    const card = document.createElement("div");
    card.className = `bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-animation opacity-0 bg-white border-2 border-gray-200`;
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
            <div class="flex items-start justify-between mb-4 ">
                <div class="flex items-center gap-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">
                            ${currency.nombre}
                        </h3>
                    </div>
                </div>
            </div>
            
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Compra</span>
                    <span class="font-medium text-gray-800">
                        ${formatCurrency(currency.compra)}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Venta</span>
                    <span class="font-medium text-gray-800">
                        ${formatCurrency(currency.venta)}
                    </span>
                </div>
            </div>
            
            <div class="mt-4 text-right">
                <span class="text-xs text-gray-400">${getTimeAgo(
                  currency.fechaActualizacion
                )}</span>
            </div>
        `;

    return card;
  };

  // Actualizar tarjeta principal
  const updateMainCard = (dolarBlue) => {
    mainCard.innerHTML = `
            <div class="flex items-center justify-between ">
                <div class="flex items-center gap-4">
                    <div>
                        <h2 class="text-xl font-bold">${dolarBlue.nombre}</h2>
                        <p class="text-sm opacity-90">Tipo de cambio blue</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-3xl font-bold">${formatCurrency(dolarBlue.venta)}</p>
                    <p class="text-sm">${getTimeAgo(
                      dolarBlue.fechaActualizacion
                    )}</p>
                </div>
            </div>
        `;
  };

  // Cargar y mostrar datos
  const loadData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      // Filtrar y ordenar datos
      const currencies = data.sort((a, b) => a.moneda.localeCompare(b.moneda));
      const dolarBlue = currencies.find((c) => c.casa === "blue");

      // Actualizar marca de tiempo
      const latestUpdate = new Date(
        Math.max(...currencies.map((c) => new Date(c.fechaActualizacion)))
      );
      updateTimeElement.textContent = ` ${latestUpdate.toLocaleDateString("es-AR")} ${latestUpdate.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      // Limpiar contenedores
      currenciesContainer.innerHTML = "";

      // Actualizar tarjeta principal
      if (dolarBlue) updateMainCard(dolarBlue);

      // Crear tarjetas
      currencies.forEach((currency, index) => {
        if (currency.casa !== "blue") {
          const card = createCurrencyCard(currency, index);
          currenciesContainer.appendChild(card);
        }
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
      updateTimeElement.textContent = "Error actualizando datos";
      updateTimeElement.classList.add("text-red-600");
    }
  };

  // Actualizar periódicamente
  loadData();
  setInterval(loadData, 60000); // Actualizar cada minuto
});
