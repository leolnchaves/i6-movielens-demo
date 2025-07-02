import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface Movie {
  movieId: number;
  title: string;
  genres: string;
  year?: number;
  imdbRating?: number;
  director?: string;
  plot?: string;
}

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/movies.json');
        const data: Movie[] = await response.json();
        setMovies(data);
      } catch (err) {
        setError('Erro ao carregar filmes');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando filmes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold">MovieLens Demo</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo com {movies.length} filmes
          </p>
        </div>
      </header>

      {/* Movies Grid */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.movieId} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {movie.title}
                  </CardTitle>
                  {movie.imdbRating && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{movie.imdbRating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Movie Info */}
                <div className="space-y-2">
                  {movie.year && (
                    <Badge variant="secondary" className="text-xs">
                      {movie.year}
                    </Badge>
                  )}
                  
                  {movie.genres && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {movie.genres.split('|').slice(0, 3).join(' • ')}
                    </p>
                  )}
                  
                  {movie.director && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Dir:</span> {movie.director}
                    </p>
                  )}
                  
                  {movie.plot && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {movie.plot}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Link to={`/movie/${movie.movieId}`} className="block">
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Play className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {movies.length === 0 && !loading && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Nenhum filme encontrado</h2>
            <p className="text-muted-foreground">
              Verifique se o arquivo movies.json está acessível.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}