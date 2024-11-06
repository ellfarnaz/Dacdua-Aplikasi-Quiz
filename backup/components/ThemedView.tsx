import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = lightColor || "white"; // Default to white if no lightColor is provided

  return (
    <View
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
