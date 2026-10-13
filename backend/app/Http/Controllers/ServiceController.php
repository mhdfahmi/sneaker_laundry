<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * GET /api/services
     * Mengambil daftar seluruh paket cuci & perawatan sepatu.
     */
    public function index(): JsonResponse
    {
        $services = Service::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar layanan berhasil diambil',
            'data' => $services,
        ]);
    }

    /**
     * GET /api/services/{id}
     */
    public function show(string $id): JsonResponse
    {
        $service = is_numeric($id)
            ? Service::find($id)
            : Service::where('slug', $id)->first();

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Layanan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service,
        ]);
    }
}
