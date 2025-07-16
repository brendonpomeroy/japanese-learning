import { useApp } from './useApp';

export const useTheme = () => {
  const { state, dispatch } = useApp();
  
  const toggleDarkMode = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { darkMode: !state.settings.darkMode }
    });
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
