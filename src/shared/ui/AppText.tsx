import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, typography } from '../lib/theme';

type TVariant = keyof typeof typography;

interface IAppTextProps extends TextProps {
  variant?: TVariant;
  color?: string;
}

export const AppText: React.FC<IAppTextProps> = ({
  variant = 'body',
  color = colors.text,
  style,
  ...rest
}) => {
  const variantStyle = typography[variant] as TextStyle;
  return <Text style={[variantStyle, { color }, style]} {...rest} />;
};