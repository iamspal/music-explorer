<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class DeezerService
{
    private Client $client;
    private const API_URL = 'https://api.deezer.com';
    private const COUNTRY = 'US';

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'headers' => [
                'Accept-Language' => 'en-US',
            ],
        ]);
    }

    private function get(string $endpoint, array $params = []): array
    {
        try {
            $params['country'] = $params['country'] ?? self::COUNTRY;

            $response = $this->client->get(self::API_URL . $endpoint, [
                'query' => $params,
            ]);

            return json_decode((string)$response->getBody(), true);
        } catch (GuzzleException $e) {
            throw new \RuntimeException('Deezer API error: ' . $e->getMessage(), $e->getCode());
        }
    }

    // --- Search ---

    public function search(string $query, string $type = 'track', int $limit = 20, int $offset = 0): array
    {
        return $this->get('/search/' . $type, [
            'q' => $query,
            'limit' => $limit,
            'index' => $offset,
        ]);
    }

    // --- Trending / Charts ---

    public function getTrendingPlaylists(int $limit = 20, int $offset = 0): array
    {
        $result = $this->get('/chart/playlists', [
            'limit' => $limit,
            'index' => $offset,
        ]);

        return $result['playlists'] ?? $result;
    }

    public function getTrendingAlbums(int $limit = 20, int $offset = 0): array
    {
        $result = $this->get('/chart/albums', [
            'limit' => $limit,
            'index' => $offset,
        ]);

        return $result['albums'] ?? $result;
    }

    public function getTrendingArtists(int $limit = 20, int $offset = 0): array
    {
        $result = $this->get('/chart/artists', [
            'limit' => $limit,
            'index' => $offset,
        ]);

        return $result['artists'] ?? $result;
    }

    // --- Individual resources ---

    public function getTrack(string $id): array
    {
        return $this->get("/track/{$id}");
    }

    public function getPlaylist(string $id): array
    {
        return $this->get("/playlist/{$id}");
    }

    public function getAlbum(string $id): array
    {
        return $this->get("/album/{$id}");
    }

    public function getArtist(string $id): array
    {
        return $this->get("/artist/{$id}");
    }

    // --- Sub-resources ---

    public function getArtistTopTracks(string $id, int $limit = 20): array
    {
        return $this->get("/artist/{$id}/top", ['limit' => $limit]);
    }

    public function getArtistAlbums(string $id, int $limit = 20): array
    {
        return $this->get("/artist/{$id}/albums", ['limit' => $limit]);
    }

    public function getRelatedArtists(string $id, int $limit = 20): array
    {
        return $this->get("/artist/{$id}/related", ['limit' => $limit]);
    }

    public function getAlbumTracks(string $id, int $limit = 50, int $offset = 0): array
    {
        return $this->get("/album/{$id}/tracks", [
            'limit' => $limit,
            'index' => $offset,
        ]);
    }

    public function getPlaylistTracks(string $id, int $limit = 50, int $offset = 0): array
    {
        return $this->get("/playlist/{$id}/tracks", [
            'limit' => $limit,
            'index' => $offset,
        ]);
    }
}
