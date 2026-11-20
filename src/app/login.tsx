import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { emailError, passwordError } from '@/data/forms';
import { useGame } from '@/state/GameProvider';
import { space } from '@/theme/tokens';

export default function LoginScreen() {
  const { state, actions } = useGame();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const errors = { email: emailError(email), password: passwordError(password) };

  if (state.session.signedIn) return <Redirect href="/" />;

  const submit = () => {
    setTouched(true);
    if (errors.email || errors.password) return;
    actions.signIn(email);
    router.replace('/');
  };

  return (
    <Screen>
      <View style={styles.brand}>
        <Icon name="sword" size={128} />
        <Text variant="display1" align="center" accessibilityRole="header">
          Bombaio
        </Text>
        <Text variant="body" tone="muted" align="center">
          Suas habilidades reais, validadas como num RPG.
        </Text>
      </View>

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@exemplo.com"
        error={touched ? errors.email : undefined}
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secure
        error={touched ? errors.password : undefined}
      />

      <Button label="Entrar" variant="gold" onPress={submit} />
      <Button label="Criar conta" onPress={() => router.push('/cadastro')} />

      <Text variant="bodySm" tone="dim" align="center">
        Versão de demonstração: qualquer e-mail válido entra no perfil de exemplo.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', gap: space.s2, paddingTop: space.s8 },
});
