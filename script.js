// Copiar o movies.json da pasta public para a raiz
fetch('public/movies.json')
    .then(response => {
        if (!response.ok) {
            // Se não conseguir carregar de public/, tentar da raiz
            return fetch('movies.json');
        }
        return response;
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load movies');
        }
        return response.json();
    })
    .then(movies => {
        console.log('Movies loaded successfully:', movies.length);
        renderMovies(movies, document.getElementById('movies-grid'));
        document.getElementById('movie-count').textContent = `Catálogo com ${movies.length} filmes`;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    })
    .catch(error => {
        console.error('Error loading movies:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'flex';
    });

// Main page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
});

async function loadMovies() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const mainContentEl = document.getElementById('main-content');
    const moviesGridEl = document.getElementById('movies-grid');
    const noMoviesEl = document.getElementById('no-movies');
    const movieCountEl = document.getElementById('movie-count');

    console.log('Starting to load movies...');
    console.log('Current URL:', window.location.href);

    try {
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
        console.log('Movies parsed successfully:', movies.length, 'movies found');
        
        loadingEl.style.display = 'none';
        
        if (movies.length === 0) {
            noMoviesEl.style.display = 'block';
        } else {
            movieCountEl.textContent = `Catálogo com ${movies.length} filmes`;
            renderMovies(movies, moviesGridEl);
        }
        
        mainContentEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading movies:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
    }
}

function renderMovies(movies, container) {
    console.log('Rendering movies...');
    container.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        container.appendChild(movieCard);
    });
    console.log('Movies rendered successfully');
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => {
        window.location.href = `movie.html?id=${movie.movieId}`;
    };
    
    const header = document.createElement('div');
    header.className = 'movie-card-header';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'movie-card-title-row';
    
    const title = document.createElement('h3');
    title.className = 'movie-card-title';
    title.textContent = movie.title;
    titleRow.appendChild(title);
    
    if (movie.imdb_rating) {
        const rating = document.createElement('div');
        rating.className = 'movie-rating';
        
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        
        const score = document.createElement('span');
        score.className = 'score';
        score.textContent = movie.imdb_rating;
        
        rating.appendChild(star);
        rating.appendChild(score);
        titleRow.appendChild(rating);
    }
    
    header.appendChild(titleRow);
    card.appendChild(header);
    
    const content = document.createElement('div');
    content.className = 'movie-card-content';
    
    const info = document.createElement('div');
    info.className = 'movie-info';
    
    if (movie.released) {
        const badge = document.createElement('span');
        badge.className = 'movie-badge';
        badge.textContent = movie.released;
        info.appendChild(badge);
    }
    
    if (movie.genres && movie.genres.length > 0) {
        const genres = document.createElement('p');
        genres.className = 'movie-genres';
        genres.textContent = movie.genres.slice(0, 3).join(' • ');
        info.appendChild(genres);
    }
    
    if (movie.director) {
        const director = document.createElement('p');
        director.className = 'movie-director';
        director.innerHTML = `<span class="label">Dir:</span> ${movie.director}`;
        info.appendChild(director);
    }
    
    if (movie.plot) {
        const plot = document.createElement('p');
        plot.className = 'movie-plot';
        plot.textContent = movie.plot;
        info.appendChild(plot);
    }
    
    content.appendChild(info);
    
    const button = document.createElement('button');
    button.className = 'btn btn-view-details';
    button.innerHTML = '▶ Ver Detalhes';
    content.appendChild(button);
    
    card.appendChild(content);
    
    return card;
}