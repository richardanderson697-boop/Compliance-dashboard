// src/app/dashboard/page.tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton" // Assuming shadcn/ui

async function getComplianceMetrics() {
  const url = process.env.INTERNAL_API_URL
  const token = process.env.API_SECRET

  if (!url || !token) {
    throw new Error("Missing Internal Configuration")
  }

  const res = await fetch(`${url}/metrics`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    next: { revalidate: 60 } // Cache data for 60 seconds (Regulatory data usually isn't sub-second)
  });

  if (!res.ok) throw new Error("Failed to fetch regulatory data")
  
  return res.json()
}

export default async function DashboardPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Compliance Overview</h1>
      
      {/* Suspense allows the rest of the layout to load while the data is fetching */}
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <MetricsContent />
      </Suspense>
    </div>
  )
}

async function MetricsContent() {
  const data = await getComplianceMetrics()
  
  // Here you would pass 'data' into your Recharts components
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Your Chart Components Go Here */}
    </div>
  )
}
