import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🌍</Text>
            <Text style={styles.title}>GNUOcto</Text>
            <Text style={styles.subtitle}>Guia de Cidades</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Bem-vindo de volta</Text>
            <Text style={styles.formSubtitle}>Faça login para continuar explorando</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>
                Não tem conta?{' '}
                <Text style={styles.linkHighlight}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logo: { fontSize: 64, marginBottom: SPACING.sm },
  title: { fontSize: 36, fontWeight: '800', color: COLORS.text, letterSpacing: 2 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
  form: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.xs },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  inputIcon: { fontSize: 16, marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.text, fontSize: 15 },
  eyeBtn: { padding: 4 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkBtn: { marginTop: SPACING.md, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: 14 },
  linkHighlight: { color: COLORS.primary, fontWeight: '700' },
});
