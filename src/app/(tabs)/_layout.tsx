import { useEffect } from 'react';
import { Redirect, router, Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { TabBar, type TabBarItem } from '@/components/TabBar';
import { useGame } from '@/state/GameProvider';
import { colors } from '@/theme/tokens';

type TabRoute = 'index' | 'skills' | 'missoes' | 'perfil';

const tabItems: readonly TabBarItem<TabRoute>[] = [
  { key: 'index', label: 'Herói', icon: 'user' },
  { key: 'skills', label: 'Skills', icon: 'star' },
  { key: 'missoes', label: 'Missões', icon: 'scroll' },
  { key: 'perfil', label: 'Perfil', icon: 'shield' },
];

function isTabRoute(name: string): name is TabRoute {
  return tabItems.some((item) => item.key === name);
}

function AppTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const { state: game } = useGame();
  const active = state.routes[state.index]?.name ?? 'index';
  const hasOpenMission = game.missions.some((mission) => !mission.done);
  const items = tabItems.map((item) => (item.key === 'missoes' ? { ...item, hasNews: hasOpenMission } : item));

  return (
    <TabBar
      items={items}
      activeKey={isTabRoute(active) ? active : 'index'}
      onSelect={(key) => {
        const route = state.routes.find((item) => item.name === key);
        if (route) navigateToTab(route.key);
      }}
    />
  );
}

export default function TabsLayout() {
  const { state } = useGame();
  const pendingAchievementId = state.pendingAchievementId;

  useEffect(() => {
    if (pendingAchievementId) router.push('/conquista');
  }, [pendingAchievementId]);

  if (!state.session.signedIn) return <Redirect href="/login" />;
  if (!state.session.onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.void } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Herói' }} />
      <Tabs.Screen name="skills" options={{ title: 'Skills' }} />
      <Tabs.Screen name="missoes" options={{ title: 'Missões' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
