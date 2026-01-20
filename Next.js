// Example: src/app/dashboard/page.tsx
async function getComplianceMetrics() {
  // This URL stays inside Railway's private network
  const res = await fetch(`${process.env.INTERNAL_API_URL}/metrics`, {
    headers: { 'Authorization': `Bearer ${process.env.API_SECRET}` }
  });
  return res.json();
}

export default async function Page() {
  const data = await getComplianceMetrics();
  // ... render your charts with Recharts
}
