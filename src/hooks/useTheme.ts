import { useApp } from './useApp';

export const useTheme = () => {
  const { state, dispatch } = useApp();
  
  const toggleDarkMode = () => {
    console.log('toggleDarkMode called, current darkMode:', state.settings.darkMode);
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { darkMode: !state.settings.darkMode }
    });
    console.log('dispatch called with darkMode:', !state.settings.darkMode);
  };
  
  const setDarkMode = (enabled: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { darkMode: enabled }
    });
  };
  
  return {
    isDarkMode: state.settings.darkMode,
    toggleDarkMode,
    setDarkMode
  };
};
