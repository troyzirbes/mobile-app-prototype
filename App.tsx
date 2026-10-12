import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppShell } from './src/components/AppShell';
import { colors } from './src/theme';

export default function App() {
  const [ready] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  if (!ready) {
    return null;
  }
  return (
    <GestureHandlerRootView style={styles.screen}>
      <LinearGradient colors={[colors.background, colors.backgroundDeep]} style={styles.screen}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
            <AppShell />
            <StatusBar style="dark" />
          </SafeAreaView>
        </SafeAreaProvider>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
    userSelect: 'none',
  },
});
