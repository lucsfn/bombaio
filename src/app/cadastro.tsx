import { useState } from 'react';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { emailError, passwordError } from '@/data/forms';
import { useGame } from '@/state/GameProvider';

export default function SignUpScreen() {
  const { actions } = useGame();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);

  const errors = {
    name: name.trim() === '' ? 'Como seu herói vai se chamar?' : undefined,
    email: emailError(email),
    password: passwordError(password),
    confirm: confirm !== password ? 'As senhas não conferem.' : undefined,
  };
  const invalid = Object.values(errors).some((error) => error !== undefined);

  const submit = () => {
    setTouched(true);
    if (invalid) return;
    actions.signUp({ name, email });
    router.replace('/onboarding');
  };

  return (
    <Screen header={<ScreenHeader title="Criar conta" subtitle="Comece sua jornada" onBack={() => router.back()} />}>
      <Input label="Nome do herói" value={name} onChangeText={setName} error={touched ? errors.name : undefined} />
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
        helper="Pelo menos 6 caracteres."
        error={touched ? errors.password : undefined}
      />
      <Input
        label="Confirmar senha"
        value={confirm}
        onChangeText={setConfirm}
        secure
        error={touched ? errors.confirm : undefined}
      />
      <Button label="Criar conta" variant="gold" onPress={submit} />
    </Screen>
  );
}
