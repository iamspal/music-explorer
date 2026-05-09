<?php

declare(strict_types=1);

namespace App\Tests\Controllers;

use App\Controllers\ResourceController;
use App\Services\DeezerService;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Response;

final class ResourceControllerTest extends TestCase
{
    #[Test]
    public function returns_playlist(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getPlaylist')
            ->with('123')
            ->willReturn(['id' => 123, 'title' => 'My Playlist']);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/playlists/123');
        $response = $controller->getPlaylist($request, new Response(), ['id' => '123']);

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertSame(123, $body['id']);
    }

    #[Test]
    public function returns_album(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getAlbum')
            ->with('456')
            ->willReturn(['id' => 456, 'title' => 'Discovery']);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/albums/456');
        $response = $controller->getAlbum($request, new Response(), ['id' => '456']);

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertSame(456, $body['id']);
    }

    #[Test]
    public function returns_artist(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getArtist')
            ->with('27')
            ->willReturn(['id' => 27, 'name' => 'Daft Punk']);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/artists/27');
        $response = $controller->getArtist($request, new Response(), ['id' => '27']);

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertSame('Daft Punk', $body['name']);
    }

    #[Test]
    public function returns_artist_top_tracks(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getArtistTopTracks')
            ->with('27', 20)
            ->willReturn(['data' => [['id' => 1, 'title' => 'One More Time']]]);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/artists/27/top-tracks');
        $response = $controller->getArtistTopTracks($request, new Response(), ['id' => '27']);

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function returns_artist_albums(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getArtistAlbums')
            ->with('27', 20)
            ->willReturn(['data' => [['id' => 302127, 'title' => 'Discovery']]]);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/artists/27/albums');
        $response = $controller->getArtistAlbums($request, new Response(), ['id' => '27']);

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function returns_related_artists(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getRelatedArtists')
            ->with('27', 20)
            ->willReturn(['data' => [['id' => 28, 'name' => 'Justice']]]);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/artists/27/related');
        $response = $controller->getRelatedArtists($request, new Response(), ['id' => '27']);

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function returns_playlist_tracks(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getPlaylistTracks')
            ->with('123', 50, 0)
            ->willReturn(['data' => [['id' => 1, 'title' => 'Track 1']]]);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/playlists/123/tracks');
        $response = $controller->getPlaylistTracks($request, new Response(), ['id' => '123']);

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function returns_album_tracks(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('getAlbumTracks')
            ->with('456', 50, 0)
            ->willReturn(['data' => [['id' => 1, 'title' => 'Track 1']]]);

        $controller = new ResourceController($deezer);
        $request = (new ServerRequestFactory())->createServerRequest('GET', '/api/albums/456/tracks');
        $response = $controller->getAlbumTracks($request, new Response(), ['id' => '456']);

        $this->assertSame(200, $response->getStatusCode());
    }
}
