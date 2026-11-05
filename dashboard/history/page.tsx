import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// Create a dummy prisma client import or fetch logic since we don't know the exact auth options setup in the workspace.
// This is a server component that fetches from DB.

async function getHistory() {
  try {
    // In a real app we would get the user ID from the session and filter by userId.
    // For now, we just fetch the latest scans.
    const scans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return scans;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HistoryPage() {
  const scans = await getHistory();

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-3xl font-bold mb-2">Scan History</h2>
        <p className="text-neutral-400">Review your past code security analysis reports.</p>
      </header>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        {scans.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 flex flex-col items-center">
            <svg className="w-12 h-12 mb-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No scans found. Go to the Code Scanner to analyze your first file!</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="text-xs uppercase bg-neutral-900/80 text-neutral-300 border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-2xl">Date</th>
                <th scope="col" className="px-6 py-4">Score</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 rounded-tr-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(scan.createdAt).toLocaleDateString()} {new Date(scan.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${scan.score < 50 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {scan.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {scan.score < 50 ? 'Vulnerable' : 'Secure'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
