import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { saveUser, getUser } from './banco';

const appIcon = require('./src/Icone.png');
const tabIcons = {
  Home: require('./src/home.png'),
  EcoPontos: require('./src/leaf.png'),
  Agendamento: require('./src/agenda.png'),
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    const result = await getUser(email.trim(), password);
    if (result.error) {
      Alert.alert('Erro', result.error);
      return;
    }

    Alert.alert('Sucesso', `Bem-vindo ${result.nome}!`);
    setEmail('');
    setPassword('');
  };

  const handleSignUp = async () => {
    if (!nome.trim() || !endereco.trim() || !telefone.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const result = await saveUser(nome.trim(), endereco.trim(), telefone.trim(), email.trim(), password);
    if (result.error) {
      Alert.alert('Erro', result.error);
      return;
    }

    Alert.alert('Sucesso', 'Usuário cadastrado!');
    setNome('');
    setEndereco('');
    setTelefone('');
    setEmail('');
    setPassword('');
    setIsLogin(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Image source={appIcon} style={styles.icon} />
          <Text style={styles.title}>EcoRP</Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                placeholderTextColor="#9cb89f"
              />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="sentences"
                placeholderTextColor="#9cb89f"
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                placeholderTextColor="#9cb89f"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9cb89f"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9cb89f"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isLogin ? handleLogin : handleSignUp}
          >
            <Text style={styles.buttonText}>
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggle}>
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {['Home', 'EcoPontos', 'Agendamento'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navButton}
            onPress={() => setActiveTab(tab)}
          >
            <Image
              source={tabIcons[tab]}
              style={[
                styles.navIcon,
                activeTab === tab && styles.navIconActive,
              ]}
            />
            <Text
              style={[
                styles.navText,
                activeTab === tab && styles.navTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf7ee',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#eaf7ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 14,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4ca85e',
  },
  form: {
    width: '100%',
    backgroundColor: '#f0fde8',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#c8e6c8',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#b8e6c8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#1a4d2e',
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#4ca85e',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggle: {
    color: '#2d7a3e',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#e6f1e6',
    backgroundColor: '#fbfff8',
    marginTop: 12,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    color: '#7a8f72',
    fontSize: 12,
  },
  navTextActive: {
    color: '#33693a',
    fontWeight: '700',
  },
});