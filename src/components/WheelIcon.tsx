import Svg, { Circle, Path } from 'react-native-svg';
import type { SearchTrack } from '../types/demo';
import { colors } from '../theme';

type Props = {
  track: SearchTrack;
  size?: number;
};

const stroke = {
  stroke: colors.ink,
  strokeWidth: 2.6,
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function WheelIcon({ track, size = 52 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {track === 'Aesthetic' ? (
        <Path
          d="M 26 16 C 26 8 42 6 36 16 M 8 30 L 32 16 L 56 30 M 12 30 Q 14 48 20 52 M 52 30 Q 50 48 44 52"
          {...stroke}
        />
      ) : null}
      {track === 'Commonalities' ? (
        <Path
          d="M 10 10 H 22 V 22 H 10 Z M 42 10 H 54 V 22 H 42 Z M 16 22 V 34 C 16 50 48 50 48 34 V 22 M 26 22 V 32 C 26 40 38 40 38 32 V 22"
          {...stroke}
        />
      ) : null}
      {track === 'Activities' ? (
        <>
          <Circle cx="32" cy="18" r="12" {...stroke} />
          <Path d="M 16 20 C 14 36 50 36 48 20 M 32 30 L 32 48 M 22 48 L 42 48" {...stroke} />
        </>
      ) : null}
      {track === 'Adventure' ? (
        <>
          <Circle cx="22" cy="20" r="9" {...stroke} />
          <Circle cx="40" cy="18" r="9" {...stroke} />
          <Circle cx="20" cy="36" r="9" {...stroke} />
          <Circle cx="38" cy="38" r="8.5" {...stroke} />
          <Path d="M 30 42 Q 27 52 22 58" {...stroke} />
        </>
      ) : null}
      {track === 'Location' ? (
        <>
          <Circle cx="32" cy="32" r="20" {...stroke} />
          <Path d="M 12 32 Q 32 26 52 32 M 12 32 Q 32 40 52 32 M 32 12 Q 42 32 32 52 M 32 12 Q 22 32 32 52" {...stroke} />
        </>
      ) : null}
    </Svg>
  );
}
