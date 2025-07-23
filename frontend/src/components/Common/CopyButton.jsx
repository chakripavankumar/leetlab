import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CopyButton = ({ text, size = 'sm' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const copyToClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('Copied to clipboard');

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={() => copyToClipBoard(text)}
      className={`tooltip tooltip-bottom
        btn btn-ghost btn-xs p-1 h-auto min-h-0 
        hover:bg-primary/10 
        transition-all duration-200 
        ${isCopied ? 'text-success' : 'text-base-content/60 hover:text-primary'}
      `}
      disabled={isCopied}
      data-tip="Copy to clipboard"
    >
      {isCopied ? (
        <CheckCircle2 className={`${sizeClasses[size]} animate-pulse`} />
      ) : (
        <Copy className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default CopyButton;
