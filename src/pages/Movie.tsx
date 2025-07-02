import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Download, Plus, Share, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Movie {
  movieId: string;
  title: string;
  genres: string[];
  name: string;
  released?: string;
  runtime?: string;
  director?: string;
  actors?: string;
  plot?: string;
  imdb_rating?: string;
  poster?: string;
  language?: string;
  country?: string;
}

export default function Movie() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch('/movies.json');
        const movies: Movie[] = await response.json();
        
        const foundMovie = movies.find(m => m.movieId.toString() === movieId);
        
        if (foundMovie) {
          setMovie(foundMovie);
        } else {
          setError('Filme não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar o filme');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando filme...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Filme não encontrado'}</h2>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        
        {/* Content over backdrop */}
        <div className="relative z-20 flex flex-col justify-between h-full p-6">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          {/* Movie info */}
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {movie.released && (
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    {movie.released}
                  </Badge>
                )}
                {movie.language && (
                  <Badge variant="outline" className="border-white text-white">
                    {movie.language}
                  </Badge>
                )}
                {movie.runtime && (
                  <span className="text-white/80">{movie.runtime}</span>
                )}
                {movie.imdb_rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white/80">{movie.imdb_rating}</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <p className="text-white/80 mb-4">
                  {movie.genres.join(' • ')}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Play className="w-5 h-5 mr-2" />
                Assistir
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                <Download className="w-5 h-5 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie details */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {movie.plot && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Sinopse</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.plot}
                  </p>
                </CardContent>
              </Card>
            )}

            {(movie.actors || movie.director) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Elenco e Equipe</h3>
                  <div className="space-y-3">
                    {movie.director && (
                      <div>
                        <span className="font-medium">Direção: </span>
                        <span className="text-muted-foreground">{movie.director}</span>
                      </div>
                    )}
                    {movie.actors && (
                      <div>
                        <span className="font-medium">Elenco: </span>
                        <span className="text-muted-foreground">{movie.actors}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ações</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Minha Lista
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Movie stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informações</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID do Filme</span>
                    <span>{movie.movieId}</span>
                  </div>
                  {movie.released && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lançamento</span>
                      <span>{movie.released}</span>
                    </div>
                  )}
                  {movie.language && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Idioma</span>
                      <span>{movie.language}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duração</span>
                      <span>{movie.runtime}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}