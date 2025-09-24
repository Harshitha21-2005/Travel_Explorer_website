// js/script.js
let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let videoBtn = document.querySelectorAll('.vid-btn');

window.onscroll = () => {
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    loginForm.classList.remove('active');
};

menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () => {
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});

formBtn.addEventListener('click', () => {
    loginForm.classList.add('active');
});

formClose.addEventListener('click', () => {
    loginForm.classList.remove('active');
});

videoBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.controls .active').classList.remove('active');
        btn.classList.add('active');
        let src = btn.getAttribute('data-src');
        document.querySelector('#video-slider').src = src;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var reviewSwiper = new Swiper(".review-slider", {
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    var brandSwiper = new Swiper(".brand-slider", {
        direction: "horizontal",
        slidesPerView: "auto",
        spaceBetween: 20,
        loop: false,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
    });

    // Explore: Unsplash + OpenWeatherMap integration
    const exploreBtn = document.getElementById('explore-btn');
    const destinationInput = document.getElementById('destination-input');
    const photosGrid = document.getElementById('photos-grid');
    const weatherCard = document.getElementById('weather-card');
    const forecastEl = document.getElementById('forecast');
    const exploreStatus = document.getElementById('explore-status');

    // Replace these with your actual keys
    //const UNSPLASH_ACCESS_KEY = window.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';
   // const OPENWEATHERMAP_API_KEY = window.OPENWEATHERMAP_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';
    const UNSPLASH_ACCESS_KEY = 'X8Zwh5lYHQoP4a9WBAmx8NxqooEceaj_Sbm1DEXBmJ4';
    const OPENWEATHERMAP_API_KEY = 'a62eb43bc308b3d32c7b60b0319ec0fb';
    function setStatus(message) {
        if (exploreStatus) {
            exploreStatus.textContent = message || '';
        }
    }

    function renderWeatherCard(data, placeLabel) {
        if (!weatherCard) return;
        if (!data) {
            weatherCard.innerHTML = '';
            return;
        }
        const tempC = Math.round(data.main.temp);
        const desc = data.weather && data.weather[0] ? data.weather[0].description : '';
        const icon = data.weather && data.weather[0] ? data.weather[0].icon : '';
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        weatherCard.innerHTML = `
            <h3>Weather in ${placeLabel}</h3>
            <div class="temp">${tempC}°C</div>
            <div class="meta">${desc}</div>
            <div class="meta">Humidity: ${humidity}% · Wind: ${wind} m/s</div>
            ${icon ? `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">` : ''}
        `;
    }

    function renderPhotos(results) {
        if (!photosGrid) return;
        photosGrid.innerHTML = '';
        if (!results || results.length === 0) {
            photosGrid.innerHTML = '<p>No photos found.</p>';
            return;
        }
        const fragment = document.createDocumentFragment();
        results.forEach(item => {
            const link = item.links && item.links.html ? item.links.html : '#';
            const alt = item.alt_description || 'Destination photo';
            const url = (item.urls && (item.urls.small || item.urls.regular)) || '';
            const photoDiv = document.createElement('a');
            photoDiv.href = link;
            photoDiv.target = '_blank';
            photoDiv.rel = 'noopener noreferrer';
            photoDiv.className = 'photo';
            photoDiv.innerHTML = `<img src="${url}" alt="${alt}">`;
            fragment.appendChild(photoDiv);
        });
        photosGrid.appendChild(fragment);
    }

    function groupForecastByDay(list) {
        const byDay = new Map();
        list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const key = date.toISOString().slice(0,10);
            const entry = byDay.get(key) || [];
            entry.push(item);
            byDay.set(key, entry);
        });
        return Array.from(byDay.entries())
            .sort((a,b) => a[0].localeCompare(b[0]))
            .slice(0,5)
            .map(([key, items]) => {
                const temps = items.map(i => i.main.temp);
                const min = Math.round(Math.min(...temps));
                const max = Math.round(Math.max(...temps));
                let pick = items.reduce((acc, i) => {
                    const hour = new Date(i.dt * 1000).getUTCHours();
                    const diff = Math.abs(12 - hour);
                    if (!acc || diff < acc.diff) return { item: i, diff };
                    return acc;
                }, null);
                pick = pick ? pick.item : items[0];
                const icon = pick.weather && pick.weather[0] ? pick.weather[0].icon : '';
                const desc = pick.weather && pick.weather[0] ? pick.weather[0].description : '';
                return { date: key, min, max, icon, desc };
            });
    }

    function renderForecastOWM(data) {
        if (!forecastEl) return;
        forecastEl.innerHTML = '';
        if (!data || !Array.isArray(data.list) || data.list.length === 0) return;
        const days = groupForecastByDay(data.list);
        const wrapper = document.createElement('div');
        wrapper.className = 'grid';
        days.forEach(d => {
            const div = document.createElement('div');
            div.className = 'day';
            const pretty = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            div.innerHTML = `
                <div class="date">${pretty}</div>
                ${d.icon ? `<img src=\"https://openweathermap.org/img/wn/${d.icon}@2x.png\" alt=\"${d.desc}\">` : ''}
                <div class="temp">${d.min}° / ${d.max}°C</div>
                <div class="meta">${d.desc}</div>
            `;
            wrapper.appendChild(div);
        });
        forecastEl.appendChild(wrapper);
    }

    function renderForecastOpenMeteo(data) {
        if (!forecastEl) return;
        forecastEl.innerHTML = '';
        if (!data || !data.daily) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'grid';
        const len = Math.min(5, data.daily.time.length);
        for (let i = 0; i < len; i++) {
            const date = data.daily.time[i];
            const min = Math.round(data.daily.temperature_2m_min[i]);
            const max = Math.round(data.daily.temperature_2m_max[i]);
            const pretty = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            const div = document.createElement('div');
            div.className = 'day';
            div.innerHTML = `
                <div class="date">${pretty}</div>
                <div class="temp">${min}° / ${max}°C</div>
                <div class="meta">Forecast</div>
            `;
            wrapper.appendChild(div);
        }
        forecastEl.appendChild(wrapper);
    }

    async function geocodePlace(place) {
        const q = encodeURIComponent(place);
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Geocoding failed');
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Location not found');
        }
        const { lat, lon, name, country, state } = data[0];
        return { lat, lon, name, country, state };
    }

    // Open-Meteo fallback (no API key required)
    async function geocodePlaceOpenMeteo(place) {
        const q = encodeURIComponent(place);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=en&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Geocoding failed (fallback)');
        const data = await res.json();
        if (!data || !Array.isArray(data.results) || data.results.length === 0) {
            throw new Error('Location not found');
        }
        const r = data.results[0];
        return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country_code, state: r.admin1 };
    }

    async function fetchWeatherOpenMeteo(place) {
        const location = await geocodePlaceOpenMeteo(place);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto&wind_speed_unit=ms`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather not found (fallback)');
        const data = await res.json();
        if (!data || !data.current_weather) throw new Error('Weather not found (fallback)');
        // Normalize to OpenWeather-like structure used by renderer
        const weather = {
            main: { temp: data.current_weather.temperature, humidity: 0 },
            weather: [{ description: `Windspeed ${data.current_weather.windspeed} m/s`, icon: '' }],
            wind: { speed: data.current_weather.windspeed }
        };
        weather.__resolvedPlace = `${location.name}${location.state ? ', ' + location.state : ''}${location.country ? ', ' + location.country : ''}`;
        renderForecastOpenMeteo(data);
        return weather;
    }

    async function fetchWeather(place) {
        try {
            const location = await geocodePlace(place);
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
            const res = await fetch(url);
            if (!res.ok) {
                let message = 'Weather not found';
                try {
                    const errJson = await res.json();
                    if (errJson && errJson.message) message = errJson.message;
                } catch (_) {}
                // Surface 401 to trigger fallback upstream
                if (res.status === 401) {
                    const e = new Error(message || 'Unauthorized');
                    e.code = 401;
                    throw e;
                }
                throw new Error(message);
            }
            const weather = await res.json();
            weather.__resolvedPlace = `${location.name || place}${location.state ? ', ' + location.state : ''}${location.country ? ', ' + location.country : ''}`;
            // Fetch and render 5-day forecast
            try {
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
                const forecastRes = await fetch(forecastUrl);
                if (forecastRes.ok) {
                    const forecastData = await forecastRes.json();
                    renderForecastOWM(forecastData);
                } else if (forecastEl) {
                    forecastEl.innerHTML = '';
                }
            } catch (_) {
                if (forecastEl) forecastEl.innerHTML = '';
            }
            return weather;
        } catch (err) {
            throw err;
        }
    }

    async function fetchPhotos(place) {
        const q = encodeURIComponent(place);
        const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=12&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Photos not found');
        const data = await res.json();
        return data.results || [];
    }

    async function exploreDestination() {
        const place = (destinationInput && destinationInput.value || '').trim();
        if (!place) {
            setStatus('Please enter a destination.');
            return;
        }
        if (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY.startsWith('YOUR_')) {
            if (weatherCard) weatherCard.innerHTML = '<p>Please set your OpenWeatherMap API key.</p>';
        }
        if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY.startsWith('YOUR_')) {
            if (photosGrid) photosGrid.innerHTML = '<p>Please set your Unsplash Access Key.</p>';
        }
        setStatus('Loading...');
        renderWeatherCard(null);
        renderPhotos([]);
        try {
            let weather = null;
            if (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY.startsWith('YOUR_')) {
                // No key: use fallback
                weather = await fetchWeatherOpenMeteo(place).catch(() => null);
            } else {
                try {
                    weather = await fetchWeather(place);
                } catch (e) {
                    if (e && (e.code === 401 || /unauthorized|invalid api key/i.test(e.message))) {
                        // Unauthorized: fallback
                        weather = await fetchWeatherOpenMeteo(place).catch(() => null);
                    } else {
                        setStatus(e.message || 'Weather error');
                        weather = null;
                    }
                }
            }

            const photos = (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY.startsWith('YOUR_'))
                ? []
                : await fetchPhotos(place).catch(() => []);
            if (weather) {
                renderWeatherCard(weather, weather.__resolvedPlace || place);
            } else {
                if (weatherCard && (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY.startsWith('YOUR_'))) {
                    weatherCard.innerHTML = '<p>Weather unavailable (missing API key).</p>';
                } else if (weatherCard) {
                    weatherCard.innerHTML = '<p>Weather unavailable.</p>';
                }
            }
            renderPhotos(photos);
            if ((!photos || photos.length === 0) && !weather) {
                setStatus('No results found. Try a different destination.');
            } else {
                setStatus('');
            }
        } catch (err) {
            setStatus(err && err.message ? err.message : 'Something went wrong. Please try again.');
        }
    }

    if (exploreBtn) {
        exploreBtn.addEventListener('click', exploreDestination);
    }
    if (destinationInput) {
        destinationInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                exploreDestination();
            }
        });
    }
});