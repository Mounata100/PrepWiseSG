import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@prepwisesg_data';

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  theme: 'dark',
  points: 0,
  level: 1,
  name: '',
  badges: [],
  registeredUsers: [], 
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  LOGOUT: 'LOGOUT',
  GUEST_MODE: 'GUEST_MODE',
  UPDATE_POINTS: 'UPDATE_POINTS',
  ADD_BADGE: 'ADD_BADGE',
  SET_THEME: 'SET_THEME',
  REGISTER_USER: 'REGISTER_USER',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
};

const calculateLevel = (points) => {
  if (points >= 2000) return 6;
  if (points >= 1000) return 5;
  if (points >= 500) return 4;
  if (points >= 250) return 3;
  if (points >= 100) return 2;
  return 1;
};

const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ACTIONS.LOGIN_SUCCESS:
      return { 
        ...state, 
        user: {
          ...action.payload, 
          completedQuizzes: action.payload.completedQuizzes || [],
        goBagItems: action.payload.goBagItems || [],
        familyMembers: action.payload.familyMembers || [],

        familyEmergencyPlanRegistered:
          action.payload.familyEmergencyPlanRegistered || false,

        healthData: action.payload.healthData || {
          bloodType: '',
          allergies: '',
          qrCodeGenerated: false
      },

      completedMissions:
        action.payload.completedMissions || {},

      prepCoins:
        action.payload.prepCoins || 0
        },
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        name: action.payload.name,
        points: action.payload.points || 0,
        level: calculateLevel(action.payload.points || 0)
      };
    
    case ACTIONS.SIGNUP_SUCCESS:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        name: action.payload.name,
        points: 0,
        level: 1,
        registeredUsers: [...state.registeredUsers, action.payload.email],
      };

    case ACTIONS.GUEST_MODE:
      return {
        ...state,
        isGuest: true,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        name: 'GUEST_OPERATOR',
        points: 0,
        level: 1,
      };
        
    case ACTIONS.LOGOUT:
      return { 
        ...initialState, 
        isLoading: false,
        registeredUsers: state.registeredUsers 
      };
    
    case ACTIONS.COMPLETE_ONBOARDING: {
      const onboardingPoints = 50;
      const updatedUser = {
        ...state.user,
        onboardingCompleted: true,
        streakType: action.payload.streakType,
        streak: Math.max(state.user?.streak || 0, 1), // Real accounts safely transition to Day 1 here
        points: onboardingPoints,
        level: calculateLevel(onboardingPoints)
      };
      return {
        ...state,
        points: onboardingPoints,
        level: calculateLevel(onboardingPoints),
        user: updatedUser,
      };
    }
    
    case ACTIONS.UPDATE_POINTS: {
      const newPoints = state.points + action.payload;
      return { 
        ...state, 
        points: newPoints,
        level: calculateLevel(newPoints),
        user: state.user ? {
          ...state.user,
          points: newPoints,
          level: calculateLevel(newPoints)
        } : null
      };
    }
    
    case ACTIONS.ADD_BADGE: {
      //const updatedBadges = [...state.badges, action.payload];
      const updatedBadges = state.badges.includes(action.payload)
        ? state.badges
        : [...state.badges, action.payload];

      return { 
        ...state, 
        badges: updatedBadges,
        user: state.user ? { ...state.user, badges: updatedBadges } : null
      };
    }
    
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTIONS.REGISTER_USER:
      return { 
        ...state, 
        registeredUsers: Array.isArray(action.payload)
          ? action.payload
          : [...state.registeredUsers, action.payload]
      };
    
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const updateUser = (updatedUser) => {
    dispatch({
      type: ACTIONS.LOGIN_SUCCESS,
      payload: updatedUser
    });

  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. 🔄 Fixed Cascade Persistence Engine
  useEffect(() => {
    if (!state.isLoading) {
      saveData(state);
    }
  }, [state.points, state.user, state.registeredUsers, state.theme, state.badges]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        
        if (parsed.registeredUsers) {
          dispatch({ 
            type: ACTIONS.REGISTER_USER, 
            payload: parsed.registeredUsers 
          });
        }

        if (parsed.user) {
          // Re-fetch the absolute fresh account node from the specific users sub-db
          const usersKey = `${STORAGE_KEY}_users`;
          const usersData = await AsyncStorage.getItem(usersKey);
          const users = usersData ? JSON.parse(usersData) : {};
          const explicitUserNode = users[parsed.user.email.toLowerCase()];

          dispatch({ 
            type: ACTIONS.LOGIN_SUCCESS, 
            payload: explicitUserNode || parsed.user 
          });
        } else {
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const saveData = async (currentState) => {
    try {
      const dataToSave = {
        user: currentState.user,
        registeredUsers: currentState.registeredUsers,
        theme: currentState.theme,
      };
      // Write to the global active runtime registry
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

      // CRITICAL FIX: If a registered user context is modifying data, write down to sub-db users pool immediately
      if (currentState.user && currentState.user.email) {
        const usersKey = `${STORAGE_KEY}_users`;
        const usersData = await AsyncStorage.getItem(usersKey);
        const users = usersData ? JSON.parse(usersData) : {};
        
        users[currentState.user.email.toLowerCase()] = currentState.user;
        await AsyncStorage.setItem(usersKey, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const emailError = validateEmail(email);
      if (emailError) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: emailError };
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: passwordError };
      }

      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : { registeredUsers: [] };
      
      const registeredUsers = parsed.registeredUsers || [];
      if (!registeredUsers.includes(email.toLowerCase())) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          error: 'No account found with this email. Please create an account first.' 
        };
      }

      const usersKey = `${STORAGE_KEY}_users`;
      const usersData = await AsyncStorage.getItem(usersKey);
      const users = usersData ? JSON.parse(usersData) : {};
      
      const user = users[email.toLowerCase()];
      if (!user || user.password !== password) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: 'Invalid password. Please try again.' };
      }

      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const signup = async (email, password, name) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const nameError = validateName(name);
      if (nameError) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: nameError };
      }

      const emailError = validateEmail(email);
      if (emailError) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: emailError };
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { success: false, error: passwordError };
      }

      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : { registeredUsers: [] };
      const registeredUsers = parsed.registeredUsers || [];
      
      if (registeredUsers.includes(email.toLowerCase())) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          error: 'An account with this email already exists. Try sign in instead.' 
        };
      }

      const newUser = {
        email: email.toLowerCase(),
        name: name.trim(),
        password: password,
        points: 0,
        level: 1,
        onboardingCompleted: false,
        streakType: null,
        streak: 1, // Installs fresh tracking state securely on step zero
        badges: [],
        completedQuizzes: [],
        goBagItems: [],
        familyMembers: [],
        familyEmergencyPlanRegistered: false,

        healthData: {
          bloodType: '',
          allergies: '',
          qrCodeGenerated: false
        },

        prepCoins: 0,

        completedMissions: {},
        createdAt: new Date().toISOString(),
      };

      const usersKey = `${STORAGE_KEY}_users`;
      const usersData = await AsyncStorage.getItem(usersKey);
      const users = usersData ? JSON.parse(usersData) : {};
      users[email.toLowerCase()] = newUser;
      await AsyncStorage.setItem(usersKey, JSON.stringify(users));

      dispatch({ type: ACTIONS.SIGNUP_SUCCESS, payload: newUser });
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const guestMode = () => {
    dispatch({ type: ACTIONS.GUEST_MODE });
  };

  const logout = async () => {
    try {
      dispatch({ type: ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updatePoints = (pointsToAdd) => {
    dispatch({ type: ACTIONS.UPDATE_POINTS, payload: pointsToAdd });
  };

  const completeOnboarding = (streakType) => {
    dispatch({
      type: ACTIONS.COMPLETE_ONBOARDING,
      payload: { streakType }
    });
  };

  const addBadge = (badge) => {
    dispatch({ type: ACTIONS.ADD_BADGE, payload: badge });
  };

  const setTheme = (theme) => {
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
  };

  return (
    <UserContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      guestMode,
      completeOnboarding,
      updatePoints,
      updateUser,
      addBadge,
      setTheme,
      validateEmail,
      validatePassword,
      validateName,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserContextProvider');
  return context;
};
