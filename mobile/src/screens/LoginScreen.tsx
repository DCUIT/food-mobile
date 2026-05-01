// LoginScreen - Đăng nhập / Đăng ký
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleLogin() {
    if (!username || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/login', { username, password });
      await AsyncStorage.setItem('token', res.data.access_token);
      await AsyncStorage.setItem('username', res.data.username);
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  }

  async function handleRegister() {
    if (!username || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await API.post('/register', { username, password });
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsRegister(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Đăng ký thất bại!');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Tab chuyển đổi */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, !isRegister && styles.tabActive]}
            onPress={() => { setIsRegister(false); setError(''); setSuccess(''); }}
          >
            <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isRegister && styles.tabActive]}
            onPress={() => { setIsRegister(true); setError(''); setSuccess(''); }}
          >
            <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        {/* Form đăng nhập */}
        {!isRegister ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tài khoản</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nhập tài khoản"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                secureTextEntry
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Form đăng ký */
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tài khoản</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nhập tài khoản"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                secureTextEntry
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text>}
            {success ? <Text style={styles.success}>{success}</Text>}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#eab308',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#eab308',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
  },
  success: {
    color: '#22c55e',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#eab308',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
