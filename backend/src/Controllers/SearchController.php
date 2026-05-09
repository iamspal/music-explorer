<?php

namespace App\Controllers;

use App\Services\DeezerService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SearchController
{
    private DeezerService $deezer;

    public function __construct(DeezerService $deezer)
    {
        $this->deezer = $deezer;
    }

    public function search(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $query = $params['q'] ?? '';
        $type = $params['type'] ?? 'track';
        $limit = min((int)($params['limit'] ?? 20), 50);
        $offset = max((int)($params['offset'] ?? 0), 0);

        if (empty(trim($query))) {
            $response->getBody()->write(json_encode([
                'error' => 'Query parameter "q" is required',
            ]));

            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $result = $this->deezer->search($query, $type, $limit, $offset);

        return $this->json($response, $result);
    }

    private function json(Response $response, array $data): Response
    {
        $response->getBody()->write(json_encode($data));

        return $response->withHeader('Content-Type', 'application/json');
    }
}
