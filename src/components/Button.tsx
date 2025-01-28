import { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className, ...props }: ButtonProps) => {
  const buttonStyle = `px-4 pb-3 rounded-2xl shadow-inner shadow-[rgba(255,255,255,0.1)] bg-white bg-opacity-5 backdrop-blur-md transition-all ease-in hover:scale-[102%] hover:shadow-[rgba(255,255,255,0.2)] text-2xl text-white`;

  return (
    <button className={`${buttonStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};
