import React from "react";
import type { PolymorphicComponentProps } from "../../types/polymorphics";

export type ButtonType = "primary" | "secondary" | "other" | "none";
type ButtonProps =
  | {
      mode?: Exclude<ButtonType, "other">;
      className?: string;
      backgroundColor?: string;
    }
  | {
      mode: "other";
      backgroundColor: string;
      className?: string;
    };
type TextProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  ButtonProps
>;
export const Button = <T extends React.ElementType>({
  children,
  as,
  mode = "primary",
  backgroundColor,
  className,
  ...rest
}: TextProps<T>): JSX.Element => {
  const Component = as || "button";
  const buttonClasses: { [key in ButtonType]: string } = {
    primary: "bg-primary text-white hover:bg-primary/80 fill-white",
    secondary: "hover:bg-gray-50",
    other: `text-secondary hover:opacity-80`,
		none: `text-sm font-semibold leading-6 text-gray-900`
  };
  const style = mode === "other" ? { backgroundColor } : undefined;
  const _class = mode !== 'none' ? `${className || ""} ${
    buttonClasses[mode]
  } inline-flex justify-center rounded-md px-2.5 py-1.5 text-sm font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`
	: `${buttonClasses[mode]} ${className}`;
  return (
    <Component className={_class} style={style} type="button" {...rest}>
      {children}
    </Component>
  );
};