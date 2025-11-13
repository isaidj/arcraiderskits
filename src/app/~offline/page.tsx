export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          You&apos;re Offline
        </h1>
        <p className="text-gray-400 text-lg">
          It looks like you&apos;re not connected to the internet. Please check your connection and try again.
        </p>
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
