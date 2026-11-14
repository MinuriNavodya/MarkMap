export const colors = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  amber: '#F59E0B',
  amberSoft: '#FBBF24',
  amberLight: '#FEF3C7',
  bg: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#111827',
  line: '#E5E7EB',
  danger: '#DC2626',
  success: '#16A34A',
  successLight: '#DCFCE7',
};

export const APP_NAME = 'MarkMap';

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
};

export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: colors.border,
  padding: 16,
  marginBottom: 14,
  ...shadow,
};

export const screenStyle = {
  flex: 1,
  backgroundColor: colors.bg,
};

export const primaryButton = {
  backgroundColor: colors.primary,
  borderRadius: 16,
  paddingVertical: 14,
  paddingHorizontal: 18,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.5,
  borderColor: colors.border,
};
