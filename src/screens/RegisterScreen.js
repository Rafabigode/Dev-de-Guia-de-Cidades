import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password);
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
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logo}>🌍</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Comece sua jornada pelo mundo</Text>
          </View>

          <View style={styles.form}>
            {[
              { label: 'Nome', icon: '👤', value: name, setter: setName, placeholder: 'Seu nome', type: 'default' },
              { label: 'E-mail', icon: '✉️', value: email, setter: setEmail, placeholder: 'seu@email.com', type: 'email-address' },
              { label: 'Senha', icon: '🔒', value: password, setter: setPassword, placeholder: 'Mínimo 6 caracteres', secure: true },
              { label: 'Confirmar Senha', icon: '🔒', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Repita sua senha', secure: true },
            ].map(({ label, icon, value, setter, placeholder, type, secure }) => (
              <View key={label} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>{icon}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={value}
                    onChangeText={setter}
                    keyboardType={type || 'default'}
                    secureTextEntry={!!secure}
                    autoCapitalize={type === 'email-address' || secure ? 'none' : 'words'}
                    autoCorrect={false}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>
                Já tem conta?{' '}
                <Text style={styles.linkHighlight}>Fazer login</Text>
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
  scroll: { flexGrow: 1, padding: SPACING.lg },
  back: { marginBottom: SPACING.md },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: SPACING.lg },
  logo: { fontSize: 48, marginBottom: SPACING.sm },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  form: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
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
