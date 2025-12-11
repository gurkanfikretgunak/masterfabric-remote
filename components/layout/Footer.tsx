'use client';

import { useState, useEffect } from 'react';

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

interface FooterProps {
  repoUrl?: string;
  authorGithub?: string;
}

export function Footer({ 
  repoUrl = 'https://github.com/gurkanfikretgunak/masterfabric-remote',
  authorGithub = 'https://github.com/gurkanfikretgunak'
}: FooterProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [showCommits, setShowCommits] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCommitHash, setLastCommitHash] = useState<string>('');

  useEffect(() => {
    // Fetch the last commit hash on mount
    fetchLastCommitHash();
  }, []);

  useEffect(() => {
    // Fetch all commits when hovering/clicking
    if (showCommits && commits.length === 0) {
      fetchCommits();
    }
  }, [showCommits]);

  const fetchLastCommitHash = async () => {
    try {
      // Extract owner and repo from URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;

      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch commit');

      const data = await response.json();
      if (data.length > 0) {
        setLastCommitHash(data[0].sha.substring(0, 7));
      }
    } catch (error) {
      console.error('Error fetching last commit hash:', error);
    }
  };

  const fetchCommits = async () => {
    setLoading(true);
    try {
      // Extract owner and repo from URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return;

      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch commits');

      const data = await response.json();
      const formattedCommits: Commit[] = data.map((commit: any) => ({
        hash: commit.sha.substring(0, 7),
        message: commit.commit.message.split('\n')[0], // First line only
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }));

      setCommits(formattedCommits);
    } catch (error) {
      console.error('Error fetching commits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-gray-500">
          {/* Source Repo Link */}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            Source
          </a>

          <span className="hidden sm:inline text-gray-300">•</span>

          {/* Author GitHub Profile */}
          <a
            href={authorGithub}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            gurkanfikretgunak
          </a>

          <span className="hidden sm:inline text-gray-300">•</span>

          {/* Last Commits Button with Popup */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowCommits(true)}
              onMouseLeave={() => setShowCommits(false)}
              onClick={() => setShowCommits(!showCommits)}
              className="hover:text-gray-700 transition-colors font-mono"
            >
              {lastCommitHash || '...'}
            </button>

            {/* Commits Popup */}
            {showCommits && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[calc(100vw-2rem)] sm:w-80 lg:w-96 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                onMouseEnter={() => setShowCommits(true)}
                onMouseLeave={() => setShowCommits(false)}
              >
                <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <span className="text-sm font-medium text-gray-900">Recent Commits</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Loading commits...
                    </div>
                  ) : commits.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {commits.map((commit, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {commit.hash}
                                </code>
                                <span className="text-xs text-gray-400">{commit.date}</span>
                              </div>
                              <p className="text-sm text-gray-900 leading-snug break-words">
                                {commit.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {commit.author}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No commits found
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <a
                    href={`${repoUrl}/commits`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center justify-center"
                  >
                    View all commits
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
