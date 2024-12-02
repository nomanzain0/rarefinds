import { openBrowserAsync } from 'expo-web-browser';
import { Text, TouchableOpacity, Platform } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, children }: Props) {
  const handlePress = async (event: any) => {
    if (Platform.OS !== 'web') {
      event.preventDefault();
      // Open the external link in an in-app browser for native platforms
      await openBrowserAsync(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={{ color: 'blue' }}>{children}</Text>
    </TouchableOpacity>
  );
}
