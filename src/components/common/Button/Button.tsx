import { FC } from "react";
import { Button as MUIButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore"; // Імпортуємо стор

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  href?: string;
  to?: string;
  color?: "primary" | "secondary";
  variant?: "contained" | "outlined";
  back?: boolean; // Додаємо пропс для кнопки "назад"
  style?: React.CSSProperties;
  logout?: boolean; // Додаємо пропс для кнопки logout
}

export const CustomButton: FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  href,
  to,
  color = "primary",
  variant = "contained",
  back,
  logout, // Отримуємо пропс logout
}) => {
  const navigate = useNavigate();
  const { logout: logoutFromStore } = useAuthStore(); // Викликаємо logout з твого стору

  const handleClick = async () => {
    if (back) {
      navigate(-1); // Повернення на попередню сторінку
    }
    if (logout) {
      await logoutFromStore(); // Викликаємо logout функцію
      navigate("/"); // Перенаправляємо на стартову сторінку
    }
    onClick?.(); // Виклик додаткової логіки, якщо передано onClick
  };

  if (href) {
    return (
      <MUIButton
        variant={variant}
        color={color}
        onClick={handleClick}
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
        onClick={handleClick}
        type={type}
        component={Link}
        to={to}
      >
        {children}
      </MUIButton>
    );
  }

  return (
    <MUIButton
      color={color}
      variant={variant}
      onClick={handleClick}
      type={type}
    >
      {children}
    </MUIButton>
  );
};
