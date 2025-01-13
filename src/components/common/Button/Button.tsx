import { FC } from "react";
import { Button as MUIButton } from "@mui/material";
import { Link } from "react-router-dom";

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode; // Дозволяє використовувати будь-який контент, включаючи строки, елементи і масиви
  type?: "button" | "submit" | "reset";
  href?: string;
  to?: string;
  color?: "primary" | "secondary";
  variant?: "contained" | "outlined";
}

export const CustomButton: FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  href,
  to,
  color = "primary",
  variant = "contained",
}) => {
  if (href) {
    return (
      <MUIButton
        variant={variant}
        color={color}
        onClick={onClick}
        type={type}
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </MUIButton>
    );
  }

  if (to) {
    return (
      <MUIButton
        color={color}
        variant={variant}
        onClick={onClick}
        type={type}
        component={Link}
        to={to}
      >
        {children}
      </MUIButton>
    );
  }

  return (
    <MUIButton color={color} variant={variant} onClick={onClick} type={type}>
      {children}
    </MUIButton>
  );
};
