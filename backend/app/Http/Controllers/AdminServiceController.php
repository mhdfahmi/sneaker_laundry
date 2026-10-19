<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminServiceController extends Controller
{
    /**
     * POST /api/admin/services
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $service = Service::create([
            'name'        => $validated['name'],
            'slug'        => $this->uniqueSlug($validated['name']),
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'duration'    => $validated['duration'] ?? '2-3 Hari',
            'material'    => $validated['material'] ?? 'Semua Bahan',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil ditambahkan',
            'data'    => $service,
        ], 201);
    }

    /**
     * PUT /api/admin/services/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $service   = Service::findOrFail($id);
        $validated = $request->validate($this->rules());

        $service->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'duration'    => $validated['duration'] ?? '2-3 Hari',
            'material'    => $validated['material'] ?? 'Semua Bahan',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil diperbarui',
            'data'    => $service,
        ]);
    }

    /**
     * DELETE /api/admin/services/{id}
     * Layanan yang sudah dipakai pesanan tidak boleh dihapus, karena
     * relasi di database akan ikut menghapus semua pesanannya.
     */
    public function destroy(string $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        $orderCount = $service->orders()->count();
        if ($orderCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Layanan tidak bisa dihapus karena sudah dipakai di {$orderCount} pesanan.",
            ], 422);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Layanan berhasil dihapus',
        ]);
    }

    private function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0|max:99999999',
            'duration'    => 'nullable|string|max:100',
            'material'    => 'nullable|string|max:255',
        ];
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'layanan';
        $slug = $base;
        $i = 2;

        while (Service::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }
}
