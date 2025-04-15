
interface ProgressBarProps {
  progress: number; // A number between 0 and 1
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress * 100}%` }}
      ></div>
    </div>
  );
}
