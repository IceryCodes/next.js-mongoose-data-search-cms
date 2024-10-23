import { ButtonHTMLAttributes, MouseEventHandler, ReactElement, useMemo } from 'react';

export enum ButtonStyleType {
  Blue = 0,
  Gray = 1,
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  element?: ReactElement;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  buttonStyle?: ButtonStyleType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const defaultButtonStyle: string = 'px-4 py-2 duration-200 rounded-lg text-center';

export const Button = ({
  text,
  element,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  buttonStyle = ButtonStyleType.Blue,
  ...restProps
}: ButtonProps) => {
  const buttonClassName = useMemo((): string => {
    switch (buttonStyle) {
      case ButtonStyleType.Blue:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case ButtonStyleType.Gray:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return '';
    }
  }, []);

  return (
    <button
      type={type ?? 'button'}
      className={element ? className : `${buttonClassName} ${defaultButtonStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {element ?? text}
    </button>
  );
};
