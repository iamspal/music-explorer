<?php

declare(strict_types=1);

namespace App\Tests\Controllers;

use App\Controllers\SearchController;
use App\Services\DeezerService;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Slim\Psr7\Factory\ServerRequestFactory;

final class SearchControllerTest extends TestCase
{
    private function createRequest(array $queryParams = []): Request
    {
        return (new ServerRequestFactory())->createServerRequest('GET', '/api/search')
            ->withQueryParams($queryParams);
    }

    #[Test]
    public function returns_400_when_query_is_missing(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $controller = new SearchController($deezer);

        $request = $this->createRequest();
        $response = $controller->search($request, new Response());

        $this->assertSame(400, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    #[Test]
    public function returns_400_when_query_is_empty(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $controller = new SearchController($deezer);

        $request = $this->createRequest(['q' => '   ']);
        $response = $controller->search($request, new Response());

        $this->assertSame(400, $response->getStatusCode());
    }

    #[Test]
    public function returns_search_results(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('search')
            ->with('daft punk', 'track', 20, 0)
            ->willReturn(['data' => [['id' => 1, 'title' => 'Get Lucky']], 'total' => 1]);

        $controller = new SearchController($deezer);
        $request = $this->createRequest(['q' => 'daft punk']);
        $response = $controller->search($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true);
        $this->assertSame('application/json', $response->getHeaderLine('Content-Type'));
        $this->assertSame(1, $body['total']);
    }

    #[Test]
    public function clamps_limit_to_50(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('search')
            ->with('test', 'track', 50, 0)
            ->willReturn(['data' => [], 'total' => 0]);

        $controller = new SearchController($deezer);
        $request = $this->createRequest(['q' => 'test', 'limit' => '100']);
        $response = $controller->search($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
    }

    #[Test]
    public function uses_specified_type(): void
    {
        $deezer = $this->createMock(DeezerService::class);
        $deezer->method('search')
            ->with('test', 'album', 20, 0)
            ->willReturn(['data' => [], 'total' => 0]);

        $controller = new SearchController($deezer);
        $request = $this->createRequest(['q' => 'test', 'type' => 'album']);
        $response = $controller->search($request, new Response());

        $this->assertSame(200, $response->getStatusCode());
    }
}
