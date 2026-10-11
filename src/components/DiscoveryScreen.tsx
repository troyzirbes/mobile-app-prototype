import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CardDeck } from './CardDeck';
import { CardDetailSheet } from './CardDetailSheet';
import {
  discoveryCards,
  filterCardsByTag,
  getCardById,
  type DiscoveryTag,
} from '../data/mockDiscoveryData';
import { colors, radii, spacing } from '../theme';

type DeckFilter = 'All' | DiscoveryTag;

const filters: DeckFilter[] = ['All', 'Trending', 'Curated'];

export function DiscoveryScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const frameWidth = Math.min(windowWidth, 440);
  const cardWidth = frameWidth - spacing.lg * 2;
  const [stageHeight, setStageHeight] = useState(0);
  const cardHeight =
    stageHeight > 180
      ? stageHeight - spacing.sm
      : Math.min(560, Math.max(320, windowHeight - 230));
  const exitDistance = Math.max(windowWidth, frameWidth) + 120;

  const [filter, setFilter] = useState<DeckFilter>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const cards = useMemo(
    () => (filter === 'All' ? discoveryCards : filterCardsByTag(filter)),
    [filter],
  );
  const openCard = openId ? (getCardById(openId) ?? null) : null;

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(null), 1800);
    return () => clearTimeout(timer);
  }, [notice]);

  const chooseFilter = (next: DeckFilter) => {
    setFilter(next);
    setOpenId(null);
  };

  const saveCard = (id: string, title: string) => {
    setSavedIds((current) => (current.includes(id) ? current : [...current, id]));
    setNotice(`Saved ${title}`);
  };

  return (
    <View style={[styles.frame, { width: frameWidth }]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.brand}>Discover</Text>
          <Text style={styles.subtitle}>Drag right to save, left to skip</Text>
        </View>
        <Text style={styles.count}>{cards.length} cards</Text>
      </View>

      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = item === filter;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Show ${item} cards`}
              onPress={() => chooseFilter(item)}
              style={[styles.filter, selected && styles.filterSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.noticeSlot}>
        {notice ? (
          <View accessibilityLiveRegion="polite" style={styles.notice}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>

      <View
        style={styles.stage}
        onLayout={(event) => {
          const next = Math.floor(event.nativeEvent.layout.height);
          setStageHeight((current) => (current === next ? current : next));
        }}
      >
        <CardDeck
          cards={cards}
          width={cardWidth}
          height={cardHeight}
          exitDistance={exitDistance}
          onSwipeRight={(card) => saveCard(card.id, card.title)}
          onSwipeLeft={(card) => setNotice(`Skipped ${card.title}`)}
          onPressCard={(card) => setOpenId(card.id)}
        />
      </View>

      <CardDetailSheet
        card={openCard}
        saved={openCard ? savedIds.includes(openCard.id) : false}
        onClose={() => setOpenId(null)}
        onConnect={(card) => {
          setNotice(`Connection sent to ${card.title}`);
          setOpenId(null);
        }}
        onSave={(card) => {
          saveCard(card.id, card.title);
          setOpenId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  titleBlock: {
    flexShrink: 1,
    paddingRight: spacing.md,
  },
  brand: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 14,
  },
  count: {
    color: colors.coralDeep,
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 2,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  filter: {
    borderRadius: radii.chip,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filterText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: colors.white,
  },
  noticeSlot: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    backgroundColor: colors.ink,
    borderRadius: radii.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  noticeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  stage: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
