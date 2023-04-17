import { GitHubFile } from '../types';
import { CharacterCount, SelectedFileList, Loading, Button } from './';
import { useFileContents } from '../useFileContents';
import { Action } from '../App';

const CHARACTER_LIMIT = 15000;

export const SelectedFiles: React.FC<{
  selectedFiles: Set<string>;
  files: GitHubFile[];
  repo: string;
  branch: string;
  dispatch: React.Dispatch<Action>;
  isLoadingFileContents: boolean;
}> = ({
  selectedFiles,
  files,
  repo,
  branch,
  dispatch,
  isLoadingFileContents,
}) => {
  const { contents, totalCharCount, memoizedSelectedFiles } = useFileContents(
    selectedFiles,
    repo,
    branch,
    dispatch
  );

  const handleDownload = () => {
    const fileContent = [...contents.values()].join('\n\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repo}-${branch}-selected-files.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const fileContent = [...contents.values()].join('\n\n');
    navigator.clipboard.writeText(fileContent).then(() => {
      alert('Contents copied to clipboard.');
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4 gap-2">
        <CharacterCount
          totalCharCount={totalCharCount}
          charLimit={CHARACTER_LIMIT}
        />
        {selectedFiles.size ? (
          <>
            <Button onClick={handleCopy}>Copy</Button>
            <Button onClick={handleDownload}>Download</Button>
            <Button
              variant="danger"
              onClick={() => dispatch({ type: 'CLEAR_SELECTED_FILES' })}
            >
              Clear
            </Button>
          </>
        ) : null}
      </div>
      {isLoadingFileContents ? (
        <Loading />
      ) : selectedFiles.size > 0 ? (
        <SelectedFileList
          selectedFiles={memoizedSelectedFiles}
          files={files}
          selectedFileContents={contents}
        />
      ) : (
        <p className="text-gray-600">
          Please select files to view their content.
        </p>
      )}
    </div>
  );
};
