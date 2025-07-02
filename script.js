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

    try {
        const response = await fetch('movies.json');
        if (!response.ok) {
            throw new Error('Failed to load movies');
        }
        
        const movies = await response.json();
        
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
    container.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        container.appendChild(movieCard);
    });
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