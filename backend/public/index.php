<?php

use App\Controllers\BrowseController;
use App\Controllers\ResourceController;
use App\Controllers\SearchController;
use App\Services\DeezerService;
use Dotenv\Dotenv;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

$deezer = new DeezerService();
$searchController = new SearchController($deezer);
$browseController = new BrowseController($deezer);
$resourceController = new ResourceController($deezer);

// CORS middleware
$app->add(function (Request $request, $handler) {
    if ($request->getMethod() === 'OPTIONS') {
        $response = new Response();

        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// Error handling
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
) use ($app) {
    $response = $app->getResponseFactory()->createResponse();
    $payload = ['error' => $exception->getMessage()];

    if ($displayErrorDetails) {
        $payload['trace'] = $exception->getTraceAsString();
    }

    $response->getBody()->write(json_encode($payload));

    return $response
        ->withStatus(500)
        ->withHeader('Content-Type', 'application/json');
});

// Health check
$app->get('/', function (Request $request, Response $response) {
    $data = [
        'status' => 'success',
        'message' => 'Deezer API proxy is running',
        'timestamp' => date('Y-m-d H:i:s'),
    ];
    $response->getBody()->write(json_encode($data));

    return $response->withHeader('Content-Type', 'application/json');
});

// Search
$app->get('/api/search', [$searchController, 'search']);

// Tracks (all served by ResourceController)
$app->get('/api/tracks/search', [$searchController, 'search']);
$app->get('/api/tracks/{id}', [$resourceController, 'getTrack']);
$app->get('/api/tracks/playlist/{id}', [$resourceController, 'getPlaylistTracks']);
$app->get('/api/tracks/album/{id}', [$resourceController, 'getAlbumTracks']);
$app->get('/api/tracks/artist/{id}/top', [$resourceController, 'getArtistTopTracks']);

// Trending / Charts
$app->get('/api/playlists/trending', [$browseController, 'trendingPlaylists']);
$app->get('/api/albums/trending', [$browseController, 'trendingAlbums']);
$app->get('/api/artists/trending', [$browseController, 'trendingArtists']);

// Playlists
$app->get('/api/playlists/{id}', [$resourceController, 'getPlaylist']);
$app->get('/api/playlists/{id}/tracks', [$resourceController, 'getPlaylistTracks']);

// Albums
$app->get('/api/albums/{id}', [$resourceController, 'getAlbum']);
$app->get('/api/albums/{id}/tracks', [$resourceController, 'getAlbumTracks']);

// Artists
$app->get('/api/artists/{id}', [$resourceController, 'getArtist']);
$app->get('/api/artists/{id}/albums', [$resourceController, 'getArtistAlbums']);
$app->get('/api/artists/{id}/top-tracks', [$resourceController, 'getArtistTopTracks']);
$app->get('/api/artists/{id}/related', [$resourceController, 'getRelatedArtists']);

$app->run();
