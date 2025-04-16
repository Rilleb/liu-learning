
interface ProgressBarProps {
  total: number;
  completed: number;
}

export default function ProgressBar({ total, completed }: ProgressBarProps) {
  const progress = completed / total;

  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700">
        {completed}/{total}
      </span>
    </div>
  );
}

