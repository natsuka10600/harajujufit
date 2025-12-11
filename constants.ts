
import { Exercise, ExerciseType } from './types';

// SPLASH SCREEN TEXT (JAPANESE DESIGN)
export const JP_DESIGN = {
  title: "ピクセル姿勢ギャル", // Pixel Posture Gyaru
  subtitle: "渋谷系デジタルコーチ", // Shibuya-style Digital Coach
  startBtn: "スタート", // START
  historyBtn: "マイルーム", // My Room (Changed from History)
  streakLabel: "連続ログイン", // Login Streak
  ver: "Ver. 1.3.0"
};

export interface LootItem {
  id: string;
  icon: string;
  name: string;
  desc: string;
  unlockCondition: string;
  unlocked: boolean;
}

export const LOOT_DB: LootItem[] = [
  { id: 'bow', icon: '🎀', name: 'ギャルリボン', desc: '基本款可愛蝴蝶結', unlockCondition: 'Default', unlocked: true },
  { id: 'glasses', icon: '🕶️', name: '巨星墨鏡', desc: '遮住黑眼圈的神器', unlockCondition: '完成 3 天打卡', unlocked: false },
  { id: 'choker', icon: '🖤', name: '龐克頸鍊', desc: '原宿街頭必備', unlockCondition: '累積 100 分鐘', unlocked: false },
  { id: 'necklace', icon: '💍', name: '鑽石項鍊', desc: '閃亮亮！Bling Bling', unlockCondition: '連續打卡 7 天', unlocked: false },
  { id: 'crown', icon: '👑', name: '女王皇冠', desc: '姿勢女王的象徵', unlockCondition: '完成 30 天挑戰', unlocked: false },
  { id: 'wings', icon: '🦋', name: '天使翅膀', desc: '背部夾緊就會長出來', unlockCondition: '解鎖所有成就', unlocked: false },
];

export const EXERCISE_DB: Exercise[] = [
  // Type 1: Relaxation
  {
    id: 'wall-pec-stretch',
    name: '靠牆胸大肌伸展',
    type: ExerciseType.RELAXATION,
    durationSec: 45,
    description: '手臂靠牆，身體往反方向轉。把心打開～感受胸口拉開的感覺！',
    gyaruTip: '把心打開！💖 項鍊露出來！Open Heart！✨'
  },
  {
    id: 'neck-side-stretch',
    name: '頸部側向伸展',
    type: ExerciseType.RELAXATION,
    durationSec: 40,
    description: '輕輕把頭倒向肩膀，另一隻手向下延伸。動作要優雅喔！',
    gyaruTip: '像拍貼機一樣可愛！📸 Pose 要 Kawaii 喔！✌️'
  },
  {
    id: 'childs-pose',
    name: '嬰兒式 (Child\'s Pose)',
    type: ExerciseType.RELAXATION,
    durationSec: 60,
    description: '跪姿，屁股坐在腳跟，雙手向前延伸趴在地上。',
    gyaruTip: '進入禪模式... 🧘‍♀️ 重新整理一下 Vibe。'
  },
  {
    id: 'hip-flexor-stretch',
    name: '跪姿髖屈肌伸展',
    type: ExerciseType.RELAXATION,
    durationSec: 45,
    description: '弓箭步跪姿，重心往前移。坐太久的人必做！',
    gyaruTip: '把髖關節打開！坐太久很不酷喔。NG！🚫'
  },

  // Type 2: Upper Posture
  {
    id: 'chin-tucks',
    name: '收下巴運動 (Chin Tucks)',
    type: ExerciseType.UPPER_POSTURE,
    durationSec: 30,
    description: '像要擠出雙下巴一樣，把頭水平往後縮。',
    gyaruTip: '鬼臉時間！🤪 把烏龜脖子收回去！🐢'
  },
  {
    id: 'w-raise',
    name: 'W字肩胛後收 (W-Raise)',
    type: ExerciseType.UPPER_POSTURE,
    durationSec: 45,
    description: '手臂比出W，往後夾緊背部，肩膀不要聳起來！',
    gyaruTip: '後面夾緊！展現你的天使翅膀！🦋 Angel Wings！'
  },
  {
    id: 'towel-pull',
    name: '毛巾頸後對抗',
    type: ExerciseType.UPPER_POSTURE,
    durationSec: 45,
    description: '毛巾放在後腦勺，手往前拉，頭用力往後推。',
    gyaruTip: '用力推！不要輸給毛巾！Fight！🔥'
  },

  // Type 3: Core & Pelvis
  {
    id: 'dead-bug',
    name: '死蟲式 (Dead Bug)',
    type: ExerciseType.CORE_PELVIS,
    durationSec: 60,
    description: '平躺，下背死死貼住地板，手腳交替延伸。',
    gyaruTip: '核心鎖死！✨ 平坦小腹就靠這招！'
  },
  {
    id: 'pelvic-tilt',
    name: '骨盆後傾運動',
    type: ExerciseType.CORE_PELVIS,
    durationSec: 45,
    description: '平躺，用力把下背貼平地面，消滅腰部空隙。',
    gyaruTip: '腰不可以浮起來！把核心鎖上！🔒 Lock on！'
  },
  {
    id: 'glute-bridge',
    name: '橋式 (Bridge)',
    type: ExerciseType.CORE_PELVIS,
    durationSec: 60,
    description: '平躺屈膝，屁股夾緊往上推。',
    gyaruTip: '再高一點！目標是星空！High起來！🌟'
  }
];

export const GYARU_PHRASES = {
  welcome: ["早安安～！✨", "哈囉！✌️", "今天也要 Slay 全場！"],
  goodJob: ["大成功！太神啦！", "優勝！女王降臨！👑", "這姿勢是模特兒等級吧！✨"],
  toughLove: ["姿勢注意！！⚠️", "不要當烏龜！🐢", "背挺直！Check！"]
};
