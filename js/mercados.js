document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano,solana,ripple&per_page=100';
    
    const fetchCryptoData = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data.map(crypto => ({
                symbol: crypto.symbol.toUpperCase(),
                name: crypto.name,
                price: crypto.current_price,
                change24h: crypto.price_change_percentage_24h
            }));
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            return null;
        }
    };

    const createCryptoCard = (crypto) => {
        const isPositive = crypto.change24h >= 0;
        return `
            <div class="inline-flex items-center bg-white border-2 border-gray-200  p-4 rounded-xl shadow-sm hover:shadow-md transition-all mx-2 min-w-[220px]">
                <div class="w-full">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold text-gray-700">${crypto.symbol}</span>
                        <span class="${isPositive ? 'text-green-500' : 'text-red-500'} text-sm flex items-center">
                            ${isPositive ? '▲' : '▼'} ${Math.abs(crypto.change24h).toFixed(2)}%
                        </span>
                    </div>
                    <p class="text-2xl font-bold text-gray-800">${crypto.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} <span class ="text-sm"> USD </span> </p>
                    <p class="text-sm text-gray-500 truncate">${crypto.name}</p>
                </div>
            </div>
        `;
    };

    const updateCarousel = async () => {
        try {
            const cryptoData = await fetchCryptoData();
            
            if(cryptoData && cryptoData.length > 0) {
                const carousel = document.getElementById('crypto-carousel');
                const carouselDupe = document.getElementById('crypto-carousel-dupe');
                
                carousel.innerHTML = cryptoData.map(createCryptoCard).join('');
                carouselDupe.innerHTML = cryptoData.map(createCryptoCard).join('');
            }
            
        } catch (error) {
            console.error('Error updating carousel:', error);
            document.getElementById('crypto-carousel').innerHTML = `
                <div class="text-red-500 p-4">Error cargando criptomonedas</div>
            `;
        }
    };

    // Actualizar cada 1 minuto
    updateCarousel();
    setInterval(updateCarousel, 60000);
});