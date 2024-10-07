import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '../../components/Collapsible';
import { ExternalLink } from '../../components/ExternalLink';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Ionicons size={310} name="leaf-outline" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Yoga</ThemedText>
      </ThemedView>
      <ThemedText>Discover the rich world of yoga and its many benefits.</ThemedText>
      <Collapsible title="What is Yoga?">
        <ThemedText>
          Yoga is an ancient practice that combines physical postures, breathing techniques, and meditation. 
          It originated in India over 5,000 years ago and has since spread worldwide, offering numerous 
          health benefits for both body and mind.
        </ThemedText>
        <ExternalLink href="https://www.yogajournal.com/yoga-101/what-is-yoga/">
          <ThemedText type="link">Learn more about Yoga</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Types of Yoga">
        <ThemedText>
          There are many styles of yoga, each with its own focus and benefits:
        </ThemedText>
        <ThemedText>• Hatha: Gentle, basic yoga poses</ThemedText>
        <ThemedText>• Vinyasa: Flowing, dynamic movements</ThemedText>
        <ThemedText>• Ashtanga: Rigorous, athletic style</ThemedText>
        <ThemedText>• Yin: Slow-paced, holding poses for longer</ThemedText>
        <ThemedText>• Bikram: Practiced in a heated room</ThemedText>
        <ExternalLink href="https://www.yogajournal.com/yoga-101/types-of-yoga/">
          <ThemedText type="link">Explore Yoga Styles</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Benefits of Yoga">
        <ThemedText>
          Regular yoga practice can provide numerous benefits:
        </ThemedText>
        <ThemedText>• Improved flexibility and strength</ThemedText>
        <ThemedText>• Better posture and balance</ThemedText>
        <ThemedText>• Reduced stress and anxiety</ThemedText>
        <ThemedText>• Enhanced mindfulness and focus</ThemedText>
        <ThemedText>• Improved sleep quality</ThemedText>
        <ExternalLink href="https://www.healthline.com/nutrition/13-benefits-of-yoga">
          <ThemedText type="link">Read about Yoga Benefits</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Getting Started">
        <ThemedText>
          To begin your yoga journey:
        </ThemedText>
        <ThemedText>1. Choose a style that interests you</ThemedText>
        <ThemedText>2. Find a qualified instructor or reputable online resource</ThemedText>
        <ThemedText>3. Start with beginner-friendly classes</ThemedText>
        <ThemedText>4. Practice regularly and be patient with yourself</ThemedText>
        <ThemedText>5. Listen to your body and respect its limits</ThemedText>
      </Collapsible>
      <Collapsible title="Yoga Equipment">
        <ThemedText>
          While yoga requires minimal equipment, these items can enhance your practice:
        </ThemedText>
        <ThemedText>• Yoga mat for comfort and grip</ThemedText>
        <ThemedText>• Yoga blocks for support in poses</ThemedText>
        <ThemedText>• Straps to help with stretching</ThemedText>
        <ThemedText>• Comfortable, breathable clothing</ThemedText>
        <ExternalLink href="https://www.yogajournal.com/lifestyle/yoga-gear-and-props-guide/">
          <ThemedText type="link">Yoga Equipment Guide</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#4CAF50',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
