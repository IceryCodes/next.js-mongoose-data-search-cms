import { ButtonHTMLAttributes, MouseEventHandler, ReactElement, useMemo } from 'react';

export enum ButtonStyleType {
  Active = 0,
  Disabled = 1,
  Warning = 2,
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
  buttonStyle = disabled ? ButtonStyleType.Disabled : ButtonStyleType.Active,
  ...restProps
}: ButtonProps) => {
  const buttonClassName = useMemo((): string => {
    switch (buttonStyle) {
      case ButtonStyleType.Active:
        return 'bg-blue-500 text-background';
      case ButtonStyleType.Disabled:
        return 'bg-gray-500 text-white';
      case ButtonStyleType.Warning:
        return 'bg-red-500 text-white';
      default:
        return '';
    }
  }, [buttonStyle]);

  return (
    <button
      type={type ?? 'button'}
      className={element ? className : `${buttonClassName} ${defaultButtonStyle} transition-all duration-300 ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...restProps}
    >
      {element ?? text}
    </button>
  );
};
