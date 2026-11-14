import type { BirthInput } from '../lib/chart';
import type { ProductId } from '../lib/products';
import { useTheme } from '../lib/theme';
import MysticLanding from './MysticLanding';
import CharacterLanding from './CharacterLanding';

type Props = {
  onSubmit: (input: BirthInput) => void;
  onSample: () => void;
  onProduct: (id: ProductId) => void;
};

/** 두 테마는 완전히 다른 랜딩을 씁니다. 계산·결제·리포트 화면은 하나를 공유합니다. */
export default function Landing(props: Props) {
  const { theme } = useTheme();
  return theme === 'character' ? <CharacterLanding {...props} /> : <MysticLanding {...props} />;
}
