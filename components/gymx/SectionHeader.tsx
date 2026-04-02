import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

interface SectionHeaderProps {
  title: string;
  onPressAction?: () => void;
  actionText?: string;
}

export const SectionHeader = ({ title, onPressAction, actionText }: SectionHeaderProps) => {
  const { theme, colorScheme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {(onPressAction || actionText) && (
        <TouchableOpacity onPress={onPressAction}>
          <Text style={[styles.actionText, { color: theme.tint }]}>{actionText || 'See All'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  }
});
