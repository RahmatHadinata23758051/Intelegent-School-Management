import clsx from 'clsx';

const CardHeader = ({ children, className }) => (
  <div className={clsx('border-b border-slate-200 pb-4', className)}>
    {children}
  </div>
);

const CardBody = ({ children, className }) => (
  <div className={clsx('py-4', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className }) => (
  <div className={clsx('border-t border-slate-200 pt-4', className)}>
    {children}
  </div>
);

export const Card = ({
  children,
  className,
  variant = 'light',
  ...props
}) => {
  const variants = {
    light: 'card-premium',
    dark: 'card-dark',
  };

  return (
    <div
      className={clsx(variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Attach subcomponents
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Also export individually for backward compatibility
export { CardHeader, CardBody, CardFooter };
