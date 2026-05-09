<?php

namespace App\Controllers;

use App\Services\DeezerService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ResourceController
{
    private DeezerService $deezer;

    public function __construct(DeezerService $deezer)
    {
        $this->deezer = $deezer;
    }

    public function getTrack(Request $request, Response $response, array $args): Response
    {
        $result = $this->deezer->getTrack($args['id']);

        return $this->json($response, $result);
    }

    public function getPlaylist(Request $request, Response $response, array $args): Response
    {
        $result = $this->deezer->getPlaylist($args['id']);

        return $this->json($response, $result);
    }

    public function getAlbum(Request $request, Response $response, array $args): Response
    {
        $result = $this->deezer->getAlbum($args['id']);

        return $this->json($response, $result);
    }

    public function getArtist(Request $request, Response $response, array $args): Response
    {
        $result = $this->deezer->getArtist($args['id']);

        return $this->json($response, $result);
    }

    public function getArtistAlbums(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $result = $this->deezer->getArtistAlbums($args['id'], $limit);

        return $this->json($response, $result);
    }

    public function getArtistTopTracks(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $result = $this->deezer->getArtistTopTracks($args['id'], $limit);

        return $this->json($response, $result);
    }

    public function getRelatedArtists(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $result = $this->deezer->getRelatedArtists($args['id'], $limit);

        return $this->json($response, $result);
    }

    public function getAlbumTracks(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 50), 100);
        $offset = max((int)($params['offset'] ?? 0), 0);
        $result = $this->deezer->getAlbumTracks($args['id'], $limit, $offset);

        return $this->json($response, $result);
    }

    public function getPlaylistTracks(Request $request, Response $response, array $args): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 50), 100);
        $offset = max((int)($params['offset'] ?? 0), 0);
        $result = $this->deezer->getPlaylistTracks($args['id'], $limit, $offset);

        return $this->json($response, $result);
    }

    private function json(Response $response, array $data): Response
    {
        $response->getBody()->write(json_encode($data));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
