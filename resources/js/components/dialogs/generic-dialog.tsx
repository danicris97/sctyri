import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "xxl";
  className?: string;
}

export function GenericDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = ""
}: GenericDialogProps) {
  const sizeClasses = {
    sm: "!max-w-sm sm:!max-w-sm md:!max-w-sm lg:!max-w-sm xl:!max-w-sm",
    md: "!max-w-sm sm:!max-w-md md:!max-w-md lg:!max-w-md xl:!max-w-md", 
    lg: "!max-w-md sm:!max-w-lg md:!max-w-lg lg:!max-w-lg xl:!max-w-lg",
    xl: "!max-w-lg sm:!max-w-xl md:!max-w-2xl lg:!max-w-2xl xl:!max-w-2xl",
    xxl: "!max-w-xl sm:!max-w-2xl md:!max-w-4xl lg:!max-w-4xl xl:!max-w-4xl",
    full: "!max-w-[90vw] sm:!max-w-full md:!max-w-full lg:!max-w-full xl:!max-w-full"
  };

  const contentClassName = `flex max-h-[90vh] flex-col ${sizeClasses[size]} ${className}`;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()} modal={true}>
      <DialogContent className={contentClassName.trim()}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            <DialogClose asChild />
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-[#4990e2] to-[#0e3b65] mt-2"></div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto py-4 pr-4 custom-scrollbar">{children}</div>

        {footer && <DialogFooter className="flex-shrink-0">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}