<?php

declare(strict_types=1);

namespace App\Tests\Controllers;

use App\Controllers\BrowseController;
use App\Services\DeezerService;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;

final class BrowseControllerTest extends TestCase
{
    #[Test]
    public function returns_trending_playlists(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getTrendingPlaylists')
            ->with(20, 0)
            ->willReturn(['data' => [['id' => 1, 'title' => 'Hot Hits']]]);

        $controller = new BrowseController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/playlists/trending');
        $response = $controller->trendingPlaylists($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertSame('application/json', $response->getHeaderLine('Content-Type'));
        $this->assertNotEmpty($body['data']);
    }

    #[Test]
    public function returns_trending_albums(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getTrendingAlbums')
            ->willReturn(['data' => [['id' => 1, 'title' => 'Great Album']]]);

        $controller = new BrowseController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/albums/trending');
        $response = $controller->trendingAlbums($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function returns_trending_artists(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getTrendingArtists')
            ->willReturn(['data' => [['id' => 1, 'name' => 'Daft Punk']]]);

        $controller = new BrowseController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/artists/trending');
        $response = $controller->trendingArtists($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
    }
}
