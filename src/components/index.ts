/* eslint-disable */
export { default as CustomModal } from './CustomModal';
export { default as Navigation } from './Navigation';
export { default as AddWord } from './AddWord';
export { default as MyList } from './MyList';
export { default as Suggestions } from './Suggestions';
export { default as Leaderboard } from './Leaderboard';
export { default as Friends } from './Friends';
export { default as ViewFriendWords } from './ViewFriendWords';
export { default as Profile } from './Profile';
// eslint-disable-next-line
let WordItem;
try {
  WordItem = require('./WordItem').default;
} catch (e) {
  console.error('Failed to load WordItem component:', e);
  WordItem = () => null;
}
export { WordItem };
