<?php

namespace App\Controllers;

use App\Services\DeezerService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class BrowseController
{
    private DeezerService $deezer;

    public function __construct(DeezerService $deezer)
    {
        $this->deezer = $deezer;
    }

    public function trendingPlaylists(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $offset = max((int)($params['offset'] ?? 0), 0);

        $result = $this->deezer->getTrendingPlaylists($limit, $offset);

        return $this->json($response, $result);
    }

    public function trendingAlbums(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $offset = max((int)($params['offset'] ?? 0), 0);

        $result = $this->deezer->getTrendingAlbums($limit, $offset);

        return $this->json($response, $result);
    }

    public function trendingArtists(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $limit = min((int)($params['limit'] ?? 20), 50);
        $offset = max((int)($params['offset'] ?? 0), 0);

        $result = $this->deezer->getTrendingArtists($limit, $offset);

        return $this->json($response, $result);
    }

    private function json(Response $response, array $data): Response
    {
        $response->getBody()->write(json_encode($data));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
