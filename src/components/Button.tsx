import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge'


export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: boolean;
};

export const Button = ({ children, className, icon, ...props }: ButtonProps) => {
  const buttonStyle = `px-4 pb-3 rounded-2xl shadow-inner shadow-[rgba(255,255,255,0.1)] bg-white bg-opacity-5 backdrop-blur-md transition-all ease-in hover:scale-[102%] hover:shadow-[rgba(255,255,255,0.2)] text-2xl text-white`;

  const iconStyle = `flex items-center justify-center gap-2 rounded-[9999px] p-4 sm:p-2`;

  return (
    <button className={twMerge(buttonStyle, icon ? iconStyle : '', className)} {...props}>
      {children}
    </button>
  );
};
