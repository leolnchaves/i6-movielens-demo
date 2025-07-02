(($) => {
    let base = '/api/customermovielens'

    class CMClient {

        async helloWorld() {
            console.log("helloWorld")
            return null
        }

        async getMovies() {
            const response = await fetch('assets/data/movies.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar movies.json: ${response.status}`);
            }
            const movies = await response.json();
            return movies;
        }

        extractUniqueGenres(movies) {
            const genresSet = new Set();
            for (let movie of movies) {
                for (let genre of movie.genres) {
                    genresSet.add(genre);
                }
            }
            return Array.from(genresSet).sort();
        }

        movieEventPost(sessionId, movieId) {
            const now = Date.now();

            const eventPayload = {
                rows: [
                    {
                        created_at: now.toString(),
                        session_id: sessionId,
                        item_id: movieId,
                        event_type: "view"
                    }
                ]
            };

            console.log("[Mock] Sending event to /session-events:");
            console.log(JSON.stringify(eventPayload, null, 2));
        }

        async getSessionRecommendation(sessionId, movieId) {
            const now = Date.now();
        
            console.log(`[Mock] Getting session-based recommendations for session=${sessionId}, movie=${movieId}`);
        
            return await {
                items: [
                    { item_id: "1", rating: 0.91 },
                    { item_id: "2", rating: 0.90 },
                    { item_id: "3", rating: 0.88 },
                    { item_id: "4", rating: 0.87 },
                    { item_id: "5", rating: 0.85 },
                    { item_id: "6", rating: 0.84 },
                    { item_id: "7", rating: 0.83 },
                    { item_id: "8", rating: 0.82 },
                    { item_id: "9", rating: 0.81 },
                    { item_id: "10", rating: 0.80 },
                ]
            };
        }

    }
    window.cmclient = new CMClient()

})(jQuery)