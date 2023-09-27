import { XMarkIcon } from "./icons";

export interface ClosableContentProps {
  onClose: () => void;
  children: React.ReactNode;
}
export const ClosableContent: React.FunctionComponent<ClosableContentProps> = ({
  onClose,
  children,
}) => {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0">
        <button className="hover:opacity-50" onClick={onClose} type="button">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      {children}
    </div>
  );
};
