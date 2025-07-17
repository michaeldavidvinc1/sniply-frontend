import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ original_url: url }),
      })
      const data = await response.json();
      console.log("🚀 ~ handleShorten ~ data:", data)
      setShortenedUrl(import.meta.env.VITE_HOST + '/' + data.data.ShortCode);
    } catch (err) {
      setError('Error' + err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      // Bisa tambahkan notifikasi success di sini
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-800 mb-2">
              Snip.LY
            </h1>
            <p className="text-gray-600">
              Shorten your URLs quickly and easily
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter URL to shorten
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleShorten}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Shortening...
                </>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>

          {/* Shortened URL Result */}
          {shortenedUrl && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Your shortened URL:
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shortenedUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-blue-600 font-medium"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-200"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Original: <span className="text-gray-800">{url}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;