<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    /**
     * Daftar status yang valid (harus sama dengan enum di tabel orders).
     */
    private const STATUSES = [
        'queued',
        'washing',
        'repaint',
        'ready_for_delivery',
        'completed',
        'cancelled',
    ];

    /**
     * GET /api/admin/orders
     * Query opsional: status, search, page
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('service')->latest();

        if ($request->filled('status') && in_array($request->input('status'), self::STATUSES, true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'LIKE', "%{$search}%")
                  ->orWhere('customer_name', 'LIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'LIKE', "%{$search}%");
            });
        }

        $paginator = $query->paginate(10);

        // Jumlah pesanan per status (untuk badge di tab filter)
        $counts = Order::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'success' => true,
            'data'    => $paginator->items(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
            'counts'  => $counts,
        ]);
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);
        $order->load('service');

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui',
            'data'    => $order,
        ]);
    }

    /**
     * GET /api/admin/dashboard
     * Ringkasan pendapatan bulanan, keuntungan bersih, dan grafik analitik 100% dari database.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $profitMargin = 0.70; // 70% estimasi laba bersih (30% bahan pembersih & operasional)
        $currentYear = (int) $request->input('year', now()->year);

        // 1. Metrik Akumulasi 100% SQL Real
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total_price');
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $activeOrders = Order::whereIn('status', ['queued', 'washing', 'repaint', 'ready_for_delivery'])->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders) : 0;

        // Pendapatan Bulan Ini (Real SQL)
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();
        $monthlyRevenue = (float) Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total_price');
        $monthlyOrders = Order::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $monthlyProfit = round($monthlyRevenue * $profitMargin, 0);
        $monthlyCost = round($monthlyRevenue * (1 - $profitMargin), 0);

        // Pendapatan Bulan Lalu (Real SQL) untuk perhitungan pertumbuhan
        $startOfLastMonth = now()->subMonth()->startOfMonth();
        $endOfLastMonth = now()->subMonth()->endOfMonth();
        $lastMonthRevenue = (float) Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total_price');

        $growthPercent = $lastMonthRevenue > 0
            ? round((($monthlyRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;

        // 2. Data Bulanan (Januari s/d Desember) 100% Real SQL
        $monthNames = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $dbMonthly = Order::selectRaw('MONTH(created_at) as month, SUM(total_price) as revenue, COUNT(*) as count')
            ->whereYear('created_at', $currentYear)
            ->where('status', '!=', 'cancelled')
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $monthlyBreakdown = [];
        $totalProfit = round($totalRevenue * $profitMargin, 0);

        for ($m = 1; $m <= 12; $m++) {
            $rev = isset($dbMonthly[$m]) ? (float) $dbMonthly[$m]->revenue : 0;
            $cnt = isset($dbMonthly[$m]) ? (int) $dbMonthly[$m]->count : 0;
            $prof = round($rev * $profitMargin, 0);
            $cst = round($rev * (1 - $profitMargin), 0);

            $monthlyBreakdown[] = [
                'month'        => $m,
                'name'         => $monthNames[$m],
                'revenue'      => $rev,
                'profit'       => $prof,
                'cost'         => $cst,
                'orders_count' => $cnt,
            ];
        }

        // 3. Status Counts (Real SQL)
        $statusCounts = Order::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // 4. Layanan Terlaris (Real SQL)
        $services = Service::all();
        $topServices = $services->map(function ($service) {
            $ordersCount = $service->orders()->where('status', '!=', 'cancelled')->count();
            $rev = (float) $service->orders()->where('status', '!=', 'cancelled')->sum('total_price');
            return [
                'id'           => $service->id,
                'name'         => $service->name,
                'price'        => (float) $service->price,
                'material'     => $service->material,
                'orders_count' => $ordersCount,
                'revenue'      => $rev,
            ];
        })->sortByDesc('orders_count')->values();

        // 5. Pesanan Terbaru
        $recentOrders = Order::with('service')->latest()->take(6)->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'metrics' => [
                    'monthly_revenue'       => $monthlyRevenue,
                    'monthly_profit'        => $monthlyProfit,
                    'monthly_cost'          => $monthlyCost,
                    'monthly_orders'        => $monthlyOrders,
                    'growth_percent'        => $growthPercent,
                    'total_revenue'         => $totalRevenue,
                    'total_profit'          => $totalProfit,
                    'profit_margin_percent' => 70,
                    'avg_order_value'       => $avgOrderValue,
                    'total_orders'          => $totalOrders,
                    'completed_orders'      => $completedOrders,
                    'active_orders'         => $activeOrders,
                ],
                'status_counts'     => $statusCounts,
                'monthly_breakdown' => $monthlyBreakdown,
                'top_services'      => $topServices,
                'recent_orders'     => $recentOrders,
                'selected_year'     => $currentYear,
            ],
        ]);
    }
}
