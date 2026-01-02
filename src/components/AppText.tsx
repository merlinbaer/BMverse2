import React from "react";
import { Text } from "react-native";

type AppTextProps = {
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "heading";
  bold?: boolean;
  color?: "primary" | "secondary" | "tertiary";
  center?: boolean;
  className?: string;
};

export function AppText({
  children,
  size = "medium",
  bold = false,
  color = "primary",
  center = false,
  className,
}: AppTextProps) {
  return <Text>{children}</Text>;
}
