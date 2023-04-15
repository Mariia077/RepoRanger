import React, { useState, useEffect } from 'react';
import { GitHubFile } from './types';
import { fetchFileContent } from './utils';

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
}> = ({ selectedFiles, files, repo }) => {
  const [selectedFileContents, setSelectedFileContents] = useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    const promises: Promise<void>[] = [];
    const newSelectedFileContents = new Map(
      [...selectedFiles].map((path) => [path, ''])
    );
    selectedFiles.forEach((path) => {
      const promise = fetchFileContent(repo, path).then((content) => {
        newSelectedFileContents.set(path, content);
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      setSelectedFileContents(newSelectedFileContents);
    });
  }, [selectedFiles, repo]);

  return (
    <div>
      <h2>Selected Files:</h2>
      <pre>
        {[...selectedFiles].map((path, index) => {
          const file = files.find((f) => f.path === path);
          if (file) {
            return (
              <div key={path}>
                <h3>
                  {index + 1}. file: {file.path}
                </h3>
                <p>{selectedFileContents.get(path)}</p>
              </div>
            );
          } else {
            return null;
          }
        })}
      </pre>
    </div>
  );
};