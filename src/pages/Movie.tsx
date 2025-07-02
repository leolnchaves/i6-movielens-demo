import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Download } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
            <p className="text-white/90 text-lg">Carregando filme...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">{error || 'Filme não encontrado'}</h2>
          <Link to="/">
            <Button className="bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/30 px-6 py-3 rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-purple-600 to-blue-700">
      {/* Header com backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Movie poster */}
        <div className="absolute inset-0">
          <img 
            src={movie.poster || `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        
        {/* Content over backdrop */}
        <div className="relative z-20 flex flex-col justify-between h-full p-6">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 border border-white/20">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>

          {/* Movie info */}
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.released && (
                  <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {movie.released}
                  </div>
                )}
                {movie.language && (
                  <div className="border border-white/40 text-white px-4 py-2 rounded-full text-sm">
                    {movie.language}
                  </div>
                )}
                {movie.runtime && (
                  <span className="text-white/90 bg-black/30 px-3 py-1 rounded-full text-sm">{movie.runtime}</span>
                )}
                {movie.imdb_rating && (
                  <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-white font-semibold">{movie.imdb_rating}</span>
                  </div>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <p className="text-white/90 mb-6 text-lg">
                  {movie.genres.join(' • ')}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg">
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-full">
                <Download className="w-5 h-5 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie details */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Synopsis */}
          {movie.plot && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Sinopse</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  {movie.plot}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Cast and crew */}
          {(movie.actors || movie.director) && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Elenco e Equipe</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {movie.director && (
                    <div className="space-y-2">
                      <span className="font-semibold text-white text-lg">Direção</span>
                      <p className="text-white/80 text-base">{movie.director}</p>
                    </div>
                  )}
                  {movie.actors && (
                    <div className="space-y-2">
                      <span className="font-semibold text-white text-lg">Elenco Principal</span>
                      <p className="text-white/80 text-base">{movie.actors}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movie Information */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Informações do Filme</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <span className="block text-white/70 text-sm mb-1">ID do Filme</span>
                  <span className="text-white font-semibold text-lg">{movie.movieId}</span>
                </div>
                {movie.released && (
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <span className="block text-white/70 text-sm mb-1">Lançamento</span>
                    <span className="text-white font-semibold text-lg">{movie.released}</span>
                  </div>
                )}
                {movie.language && (
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <span className="block text-white/70 text-sm mb-1">Idioma</span>
                    <span className="text-white font-semibold text-lg">{movie.language}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <span className="block text-white/70 text-sm mb-1">Duração</span>
                    <span className="text-white font-semibold text-lg">{movie.runtime}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}