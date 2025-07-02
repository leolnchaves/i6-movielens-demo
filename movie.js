// Movie detail page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadMovie();
});

function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function loadMovie() {
    const movieId = getMovieIdFromUrl();
    
    console.log('Loading movie with ID:', movieId);
    console.log('Current URL:', window.location.href);
    
    if (!movieId) {
        showError('ID do filme não fornecido');
        return;
    }
    
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const movieContentEl = document.getElementById('movie-content');

    try {
        console.log('Fetching movies data...');
        console.log('Trying to load from public/movies.json...');
        
        let response = await fetch('public/movies.json');
        console.log('Response from public/movies.json:', response.status, response.statusText);
        
        if (!response.ok) {
            console.log('Failed to load from public/, trying root movies.json...');
            response = await fetch('movies.json');
            console.log('Response from movies.json:', response.status, response.statusText);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('Response received, parsing JSON...');
        const movies = await response.json();
        console.log('Movies loaded:', movies.length, 'total movies');
        
        const movie = movies.find(m => m.movieId.toString() === movieId);
        console.log('Found movie:', movie ? movie.title : 'Not found');
        
        loadingEl.style.display = 'none';
        
        if (!movie) {
            showError('Filme não encontrado');
            return;
        }
        
        renderMovie(movie);
        movieContentEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading movie:', error);
        loadingEl.style.display = 'none';
        showError('Erro ao carregar o filme');
    }
}

function showError(message) {
    const errorEl = document.getElementById('error');
    const errorContent = errorEl.querySelector('.error-content h2');
    errorContent.textContent = message;
    errorEl.style.display = 'flex';
}

function renderMovie(movie) {
    console.log('Rendering movie:', movie.title);
    
    // Update page title
    document.title = `${movie.title} - MovieLens Demo`;
    
    // Movie title
    document.getElementById('movie-title').textContent = movie.title;
    
    // Movie badges
    const badgesContainer = document.getElementById('movie-badges');
    badgesContainer.innerHTML = '';
    
    if (movie.released) {
        const yearBadge = document.createElement('span');
        yearBadge.className = 'movie-badge-year';
        yearBadge.textContent = movie.released;
        badgesContainer.appendChild(yearBadge);
    }
    
    if (movie.language) {
        const langBadge = document.createElement('span');
        langBadge.className = 'movie-badge-lang';
        langBadge.textContent = movie.language;
        badgesContainer.appendChild(langBadge);
    }
    
    if (movie.runtime) {
        const runtime = document.createElement('span');
        runtime.className = 'movie-runtime';
        runtime.textContent = movie.runtime;
        badgesContainer.appendChild(runtime);
    }
    
    if (movie.imdb_rating) {
        const rating = document.createElement('div');
        rating.className = 'movie-rating-hero';
        
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        
        const score = document.createElement('span');
        score.className = 'score';
        score.textContent = movie.imdb_rating;
        
        rating.appendChild(star);
        rating.appendChild(score);
        badgesContainer.appendChild(rating);
    }
    
    // Movie genres
    if (movie.genres && movie.genres.length > 0) {
        document.getElementById('movie-genres').textContent = movie.genres.join(' • ');
    }
    
    // Synopsis
    if (movie.plot) {
        document.getElementById('movie-plot').textContent = movie.plot;
        document.getElementById('synopsis-card').style.display = 'block';
    }
    
    // Cast and crew
    const castInfo = document.getElementById('cast-info');
    let hasCastInfo = false;
    
    if (movie.director || movie.actors) {
        castInfo.innerHTML = '';
        
        if (movie.director) {
            const directorDiv = document.createElement('div');
            directorDiv.className = 'cast-info-item';
            directorDiv.innerHTML = `
                <span class="label">Direção:</span>
                <span class="value">${movie.director}</span>
            `;
            castInfo.appendChild(directorDiv);
            hasCastInfo = true;
        }
        
        if (movie.actors) {
            const actorsDiv = document.createElement('div');
            actorsDiv.className = 'cast-info-item';
            actorsDiv.innerHTML = `
                <span class="label">Elenco:</span>
                <span class="value">${movie.actors}</span>
            `;
            castInfo.appendChild(actorsDiv);
            hasCastInfo = true;
        }
    }
    
    if (hasCastInfo) {
        document.getElementById('cast-card').style.display = 'block';
    }
    
    // Movie stats
    const statsContainer = document.getElementById('movie-stats');
    statsContainer.innerHTML = '';
    
    const stats = [
        { label: 'ID do Filme', value: movie.movieId },
        { label: 'Lançamento', value: movie.released },
        { label: 'Idioma', value: movie.language },
        { label: 'Duração', value: movie.runtime }
    ];
    
    stats.forEach(stat => {
        if (stat.value) {
            const statDiv = document.createElement('div');
            statDiv.className = 'movie-stat';
            statDiv.innerHTML = `
                <span class="label">${stat.label}</span>
                <span>${stat.value}</span>
            `;
            statsContainer.appendChild(statDiv);
        }
    });
    
    console.log('Movie rendered successfully');
}