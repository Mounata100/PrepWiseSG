import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateLeaderboardUser } from '../services/firestoreService';

/*
|--------------------------------------------------------------------------
| STORAGE
|--------------------------------------------------------------------------
*/

const STORAGE_KEY = '@prepwisesg_data';
const USERS_STORAGE_KEY = '@prepwisesg_data_users';
const GUEST_STORAGE_KEY = '@prepwisesg_guest';

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialState = {
  user: null,

  // Registered account
  isAuthenticated: false,

  // Guest session
  isGuest: false,

  isLoading: true,

  theme: 'dark',

  points: 0,
  level: 1,

  name: '',

  badges: [],

  registeredUsers: [],
};

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',

  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',

  GUEST_MODE: 'GUEST_MODE',
  UPDATE_GUEST: 'UPDATE_GUEST',

  LOGOUT: 'LOGOUT',

  UPDATE_POINTS: 'UPDATE_POINTS',
  ADD_BADGE: 'ADD_BADGE',

  SET_THEME: 'SET_THEME',

  REGISTER_USER: 'REGISTER_USER',

  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',

  SPEND_PREP_COINS: 'SPEND_PREP_COINS',

  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  REMOVE_INVENTORY_ITEM: 'REMOVE_INVENTORY_ITEM',

  UPDATE_HEALTH_DATA: 'UPDATE_HEALTH_DATA',

  UPDATE_FAMILY_MEMBERS: 'UPDATE_FAMILY_MEMBERS',

  UPDATE_COMPLETED_MISSIONS: 'UPDATE_COMPLETED_MISSIONS',

  UPDATE_FAMILY_EMERGENCY_PLAN_STATUS: 'UPDATE_FAMILY_EMERGENCY_PLAN_STATUS',

  UPDATE_COMPLETED_QUIZZES: 'UPDATE_COMPLETED_QUIZZES',

  UPDATE_STREAK: 'UPDATE_STREAK',

  ADD_PREP_COINS: 'ADD_PREP_COINS',

  ADD_COMPLETED_MISSION: 'ADD_COMPLETED_MISSION',
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const calculateLevel = (points = 0) => {
  if (points >= 2000) return 6;
  if (points >= 1000) return 5;
  if (points >= 500) return 4;
  if (points >= 250) return 3;
  if (points >= 100) return 2;

  return 1;
};

/*
|--------------------------------------------------------------------------
| DEFAULT USER DATA
|--------------------------------------------------------------------------
*/

const createDefaultUserData = ({
  email = '',
  name = '',
  isGuest = false,
} = {}) => ({
  id: isGuest
    ? 'guest-local-user'
    : `user-${Date.now()}`,

  email,

  name,

  isGuest,

  password: isGuest ? undefined : '',

  points: 0,

  level: 1,

  onboardingCompleted: false,

  streakType: null,

  streak: 0,

  badges: [],

  completedQuizzes: [],

  completedMissions: {},

  goBagItems: [],

  inventory: [],

  familyMembers: [],

  familyEmergencyPlanRegistered: false,

  healthData: {
    bloodType: '',
    allergies: '',
    qrCodeGenerated: false,
  },

  prepCoins: 0,

  createdAt: new Date().toISOString(),
});

/*
|--------------------------------------------------------------------------
| NORMALISE USER
|--------------------------------------------------------------------------
|
| Makes sure old users created with an earlier version of the app
| receive the new fields without breaking.
|--------------------------------------------------------------------------
*/

const normaliseUser = (user = {}) => {
  const safePoints = Number(user.points) || 0;

  return {
    ...user,

    id: user.id || `user-${Date.now()}`,

    name: user.name || '',

    points: safePoints,

    level: calculateLevel(safePoints),

    badges: Array.isArray(user.badges)
      ? user.badges
      : [],

    completedQuizzes:
      Array.isArray(user.completedQuizzes)
        ? user.completedQuizzes
        : [],

    completedMissions:
      user.completedMissions &&
      typeof user.completedMissions === 'object'
        ? user.completedMissions
        : {},

    goBagItems:
      Array.isArray(user.goBagItems)
        ? user.goBagItems
        : [],

    inventory:
      Array.isArray(user.inventory)
        ? user.inventory
        : [],

    familyMembers:
      Array.isArray(user.familyMembers)
        ? user.familyMembers
        : [],

    familyEmergencyPlanRegistered:
      Boolean(user.familyEmergencyPlanRegistered),

    healthData: {
      bloodType:
        user.healthData?.bloodType || '',

      allergies:
        user.healthData?.allergies || '',

      qrCodeGenerated:
        Boolean(user.healthData?.qrCodeGenerated),
    },

    prepCoins:
      Number(user.prepCoins) || 0,

    streak:
      Number(user.streak) || 0,

    streakType:
      user.streakType || null,

    onboardingCompleted:
      Boolean(user.onboardingCompleted),
  };
};

/*
|--------------------------------------------------------------------------
| REDUCER
|--------------------------------------------------------------------------
*/

const userReducer = (state, action) => {
  switch (action.type) {
    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    case ACTIONS.LOGIN_SUCCESS: {
      const user = normaliseUser(action.payload);

      return {
        ...state,

        user,

        isAuthenticated: true,

        isGuest: false,

        isLoading: false,

        name: user.name,

        points: user.points,

        level: calculateLevel(user.points),

        badges: user.badges,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | SIGNUP
    |--------------------------------------------------------------------------
    */

    case ACTIONS.SIGNUP_SUCCESS: {
      const user = normaliseUser(action.payload);

      return {
        ...state,

        user,

        isAuthenticated: true,

        isGuest: false,

        isLoading: false,

        name: user.name,

        points: user.points,

        level: 1,

        badges: user.badges,

        registeredUsers:
          state.registeredUsers.includes(user.email)
            ? state.registeredUsers
            : [
                ...state.registeredUsers,
                user.email,
              ],
      };
    }

    /*
    |--------------------------------------------------------------------------
    | GUEST MODE
    |--------------------------------------------------------------------------
    */

    case ACTIONS.GUEST_MODE: {
      const guestUser = normaliseUser({
        ...action.payload,

        id: 'guest-local-user',

        email: '',

        name:
          action.payload?.name ||
          'GUEST OPERATOR',

        isGuest: true,

        password: undefined,
      });

      return {
        ...state,

        user: guestUser,

        isAuthenticated: false,

        isGuest: true,

        isLoading: false,

        name: guestUser.name,

        points: guestUser.points,

        level: guestUser.level,

        badges: guestUser.badges,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    case ACTIONS.LOGOUT:
      return {
        ...initialState,

        isLoading: false,

        registeredUsers:
          state.registeredUsers,
      };

    /*
    |--------------------------------------------------------------------------
    | POINTS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_POINTS: {
      const amount = Number(action.payload) || 0;

      const newPoints =
        Math.max(0, state.points + amount);

      const newLevel =
        calculateLevel(newPoints);

      return {
        ...state,

        points: newPoints,

        level: newLevel,

        user: state.user
          ? {
              ...state.user,

              points: newPoints,

              level: newLevel,
            }
          : null,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | BADGES
    |--------------------------------------------------------------------------
    */

    case ACTIONS.ADD_BADGE: {
      if (!action.payload) {
        return state;
      }

      const currentBadges =
        Array.isArray(state.user?.badges)
          ? state.user.badges
          : [];

      if (currentBadges.includes(action.payload)) {
        return state;
      }

      const updatedBadges = [
        ...currentBadges,
        action.payload,
      ];

      return {
        ...state,

        badges: updatedBadges,

        user: state.user
          ? {
              ...state.user,
              badges: updatedBadges,
            }
          : null,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | THEME
    |--------------------------------------------------------------------------
    */

    case ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    /*
    |--------------------------------------------------------------------------
    | REGISTERED USERS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.REGISTER_USER:
      return {
        ...state,

        registeredUsers:
          Array.isArray(action.payload)
            ? action.payload
            : [
                ...state.registeredUsers,
                action.payload,
              ],
      };

    /*
    |--------------------------------------------------------------------------
    | ONBOARDING
    |--------------------------------------------------------------------------
    */

    case ACTIONS.COMPLETE_ONBOARDING: {
      const onboardingPoints =
        state.user?.onboardingCompleted
          ? state.points
          : state.points + 50;

      const updatedUser = state.user
        ? {
            ...state.user,

            onboardingCompleted: true,

            streakType:
              action.payload?.streakType ||
              state.user.streakType,

            streak: Math.max(
              state.user.streak || 0,
              1
            ),

            points: onboardingPoints,

            level:
              calculateLevel(onboardingPoints),
          }
        : null;

      return {
        ...state,

        points: onboardingPoints,

        level:
          calculateLevel(onboardingPoints),

        user: updatedUser,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | PREP COINS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.SPEND_PREP_COINS: {
      const amount =
        Number(action.payload) || 0;

      const currentCoins =
        Number(state.user?.prepCoins) || 0;

      const newCoins =
        Math.max(0, currentCoins - amount);

      return {
        ...state,

        user: state.user
          ? {
              ...state.user,
              prepCoins: newCoins,
            }
          : null,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | ADD PREP COINS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.ADD_PREP_COINS: {
      const amount =
        Number(action.payload) || 0;

      const currentCoins =
        Number(state.user?.prepCoins) || 0;

      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              prepCoins:
                currentCoins + amount,
            }
          : null,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | INVENTORY
    |--------------------------------------------------------------------------
    */

    case ACTIONS.ADD_INVENTORY_ITEM: {
      if (!state.user) {
        return state;
      }

      const currentInventory =
        Array.isArray(state.user.inventory)
          ? state.user.inventory
          : [];

      return {
        ...state,

        user: {
          ...state.user,

          inventory: [
            action.payload,
            ...currentInventory,
          ],
        },
      };
    }

    case ACTIONS.REMOVE_INVENTORY_ITEM: {
      if (!state.user) {
        return state;
      }

      const currentInventory =
        Array.isArray(state.user.inventory)
          ? state.user.inventory
          : [];

      const updatedInventory =
        currentInventory.filter(
          (item) => item?.id !== action.payload
        );

      return {
        ...state,

        user: {
          ...state.user,

          inventory: updatedInventory,
        },
      };
    }

    /*
    |--------------------------------------------------------------------------
    | HEALTH DATA
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_HEALTH_DATA:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              healthData: {
                ...state.user.healthData,

                ...action.payload,
              },
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | FAMILY MEMBERS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_FAMILY_MEMBERS:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              familyMembers:
                Array.isArray(action.payload)
                  ? action.payload
                  : [],
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | FAMILY EMERGENCY PLAN
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_FAMILY_EMERGENCY_PLAN_STATUS:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              familyEmergencyPlanRegistered:
                Boolean(action.payload),
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | COMPLETED QUIZZES
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_COMPLETED_QUIZZES:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              completedQuizzes:
                Array.isArray(action.payload)
                  ? action.payload
                  : [],
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | COMPLETED MISSIONS
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_COMPLETED_MISSIONS:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              completedMissions:
                action.payload || {},
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | ADD COMPLETED MISSION
    |--------------------------------------------------------------------------
    */

    case ACTIONS.ADD_COMPLETED_MISSION: {
      if (!state.user) {
        return state;
      }

      const missionId =
        action.payload?.id ||
        action.payload;

      if (!missionId) {
        return state;
      }

      const currentMissions =
        state.user.completedMissions || {};

      return {
        ...state,

        user: {
          ...state.user,

          completedMissions: {
            ...currentMissions,

            [missionId]: true,
          },
        },
      };
    }

    /*
    |--------------------------------------------------------------------------
    | STREAK
    |--------------------------------------------------------------------------
    */

    case ACTIONS.UPDATE_STREAK:
      return {
        ...state,

        user: state.user
          ? {
              ...state.user,

              streak:
                Number(action.payload) || 0,
            }
          : null,
      };

    /*
    |--------------------------------------------------------------------------
    | DEFAULT
    |--------------------------------------------------------------------------
    */

    default:
      return state;
  }
};

/*
|--------------------------------------------------------------------------
| CONTEXT
|--------------------------------------------------------------------------
*/

const UserContext = createContext(null);

/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    userReducer,
    initialState
  );

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate initialisation
  |--------------------------------------------------------------------------
  */

  const hasLoadedRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadData = useCallback(async () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Load global app data
      |--------------------------------------------------------------------------
      */

      const data =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      const parsed = data
        ? JSON.parse(data)
        : {};

      /*
      |--------------------------------------------------------------------------
      | Registered user emails
      |--------------------------------------------------------------------------
      */

      if (
        Array.isArray(
          parsed.registeredUsers
        )
      ) {
        dispatch({
          type: ACTIONS.REGISTER_USER,
          payload:
            parsed.registeredUsers,
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Check saved guest session
      |--------------------------------------------------------------------------
      */

      const guestData =
        await AsyncStorage.getItem(
          GUEST_STORAGE_KEY
        );

      if (guestData) {
        const guestUser =
          normaliseUser(
            JSON.parse(guestData)
          );

        dispatch({
          type: ACTIONS.GUEST_MODE,
          payload: guestUser,
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Check saved registered session
      |--------------------------------------------------------------------------
      */

      if (parsed.user) {
        const usersData =
          await AsyncStorage.getItem(
            USERS_STORAGE_KEY
          );

        const users = usersData
          ? JSON.parse(usersData)
          : {};

        const email =
          parsed.user.email
            ?.toLowerCase();

        const explicitUserNode =
          email
            ? users[email]
            : null;

        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload:
            explicitUserNode ||
            parsed.user,
        });

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | No active session
      |--------------------------------------------------------------------------
      */

      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
    } catch (error) {
      console.error(
        'Error loading user data:',
        error
      );

      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;

    loadData();
  }, [loadData]);

  /*
  |--------------------------------------------------------------------------
  | SAVE DATA
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We intentionally depend on individual state properties rather than
  | the entire `state` object.
  |
  | This removes:
  |
  | React Hook useEffect has a missing dependency: 'state'
  |
  | without creating an unnecessary save cycle for every reducer object.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    const saveCurrentState = async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | Guest
        |--------------------------------------------------------------------------
        |
        | Guests are LOCAL ONLY.
        |
        | Nothing is sent to Firestore.
        |--------------------------------------------------------------------------
        */

        if (state.isGuest && state.user) {
          await AsyncStorage.setItem(
            GUEST_STORAGE_KEY,
            JSON.stringify(state.user)
          );

          /*
          | Remove any stale registered-user session.
          */

          await AsyncStorage.removeItem(
            STORAGE_KEY
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Registered user
        |--------------------------------------------------------------------------
        */

        const dataToSave = {
          user: state.user,
          registeredUsers:
            state.registeredUsers,
          theme: state.theme,
        };

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(dataToSave)
        );

        /*
        |--------------------------------------------------------------------------
        | Save user-specific local record
        |--------------------------------------------------------------------------
        */

        if (
          state.user &&
          state.user.email &&
          !state.user.isGuest
        ) {
          const usersData =
            await AsyncStorage.getItem(
              USERS_STORAGE_KEY
            );

          const users = usersData
            ? JSON.parse(usersData)
            : {};

          users[
            state.user.email.toLowerCase()
          ] = state.user;

          await AsyncStorage.setItem(
            USERS_STORAGE_KEY,
            JSON.stringify(users)
          );
        }
      } catch (error) {
        console.error(
          'Error saving user data:',
          error
        );
      }
    };

    saveCurrentState();
  }, [
    state.isLoading,
    state.isGuest,
    state.user,
    state.registeredUsers,
    state.theme,
  ]);

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateEmail = useCallback(
    (email) => {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        return 'Email is required';
      }

      if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
      }

      return null;
    },
    []
  );

  const validatePassword = useCallback(
    (password) => {
      if (!password) {
        return 'Password is required';
      }

      if (password.length < 6) {
        return 'Password must be at least 6 characters';
      }

      return null;
    },
    []
  );

  const validateName = useCallback(
    (name) => {
      if (!name?.trim()) {
        return 'Name is required';
      }

      if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
      }

      return null;
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const login = useCallback(
    async (email, password) => {
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: true,
      });

      try {
        const normalisedEmail =
          email?.trim().toLowerCase();

        const emailError =
          validateEmail(normalisedEmail);

        if (emailError) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,
            error: emailError,
          };
        }

        const passwordError =
          validatePassword(password);

        if (passwordError) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,
            error: passwordError,
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Load registered users
        |--------------------------------------------------------------------------
        */

        const data =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        const parsed = data
          ? JSON.parse(data)
          : {};

        const registeredUsers =
          parsed.registeredUsers || [];

        if (
          !registeredUsers.includes(
            normalisedEmail
          )
        ) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,

            error:
              'No account found with this email. Please create an account first.',
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Load actual user
        |--------------------------------------------------------------------------
        */

        const usersData =
          await AsyncStorage.getItem(
            USERS_STORAGE_KEY
          );

        const users = usersData
          ? JSON.parse(usersData)
          : {};

        const user =
          users[normalisedEmail];

        if (
          !user ||
          user.password !== password
        ) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,

            error:
              'Invalid password. Please try again.',
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Clear guest session when real user logs in
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.removeItem(
          GUEST_STORAGE_KEY
        );

        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: user,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Login error:',
          error
        );

        dispatch({
          type: ACTIONS.SET_LOADING,
          payload: false,
        });

        return {
          success: false,

          error:
            'An error occurred. Please try again.',
        };
      }
    },
    [
      validateEmail,
      validatePassword,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | SIGNUP
  |--------------------------------------------------------------------------
  */

  const signup = useCallback(
    async (email, password, name) => {
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: true,
      });

      try {
        const trimmedName =
          name?.trim();

        const normalisedEmail =
          email?.trim().toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */

        const nameError =
          validateName(trimmedName);

        if (nameError) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,
            error: nameError,
          };
        }

        const emailError =
          validateEmail(normalisedEmail);

        if (emailError) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,
            error: emailError,
          };
        }

        const passwordError =
          validatePassword(password);

        if (passwordError) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,
            error: passwordError,
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Check existing users
        |--------------------------------------------------------------------------
        */

        const data =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        const parsed = data
          ? JSON.parse(data)
          : {};

        const registeredUsers =
          parsed.registeredUsers || [];

        if (
          registeredUsers.includes(
            normalisedEmail
          )
        ) {
          dispatch({
            type: ACTIONS.SET_LOADING,
            payload: false,
          });

          return {
            success: false,

            error:
              'An account with this email already exists. Try sign in instead.',
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Create user
        |--------------------------------------------------------------------------
        */

        const newUser =
          normaliseUser({
            id: `user-${Date.now()}`,

            email: normalisedEmail,

            name: trimmedName,

            password,

            points: 0,

            level: 1,

            onboardingCompleted: false,

            streakType: null,

            streak: 0,

            badges: [],

            completedQuizzes: [],

            goBagItems: [],

            familyMembers: [],

            familyEmergencyPlanRegistered:
              false,

            healthData: {
              bloodType: '',
              allergies: '',
              qrCodeGenerated: false,
            },

            prepCoins: 0,

            completedMissions: {},

            inventory: [],

            createdAt:
              new Date().toISOString(),

            isGuest: false,
          });

        /*
        |--------------------------------------------------------------------------
        | Save user-specific record
        |--------------------------------------------------------------------------
        */

        const usersData =
          await AsyncStorage.getItem(
            USERS_STORAGE_KEY
          );

        const users = usersData
          ? JSON.parse(usersData)
          : {};

        users[normalisedEmail] =
          newUser;

        await AsyncStorage.setItem(
          USERS_STORAGE_KEY,
          JSON.stringify(users)
        );

        /*
        |--------------------------------------------------------------------------
        | Remove guest session
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.removeItem(
          GUEST_STORAGE_KEY
        );

        /*
        |--------------------------------------------------------------------------
        | Activate account
        |--------------------------------------------------------------------------
        */

        dispatch({
          type: ACTIONS.SIGNUP_SUCCESS,
          payload: newUser,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Signup error:',
          error
        );

        dispatch({
          type: ACTIONS.SET_LOADING,
          payload: false,
        });

        return {
          success: false,

          error:
            'An error occurred. Please try again.',
        };
      }
    },
    [
      validateEmail,
      validatePassword,
      validateName,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | GUEST MODE
  |--------------------------------------------------------------------------
  */

  const guestMode = useCallback(
    async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | See if a guest already exists
        |--------------------------------------------------------------------------
        */

        const existingGuest =
          await AsyncStorage.getItem(
            GUEST_STORAGE_KEY
          );

        let guestUser;

        if (existingGuest) {
          guestUser =
            normaliseUser(
              JSON.parse(existingGuest)
            );
        } else {
          guestUser =
            createDefaultUserData({
              name: 'GUEST OPERATOR',

              isGuest: true,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Make sure it is always marked guest
        |--------------------------------------------------------------------------
        */

        guestUser = normaliseUser({
          ...guestUser,

          id: 'guest-local-user',

          email: '',

          isGuest: true,

          name:
            guestUser.name ||
            'GUEST OPERATOR',
        });

        /*
        |--------------------------------------------------------------------------
        | Save immediately
        |--------------------------------------------------------------------------
        |
        | This is important.
        |
        | The guest session exists before navigation occurs.
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.setItem(
          GUEST_STORAGE_KEY,
          JSON.stringify(guestUser)
        );

        /*
        |--------------------------------------------------------------------------
        | Remove registered session
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.removeItem(
          STORAGE_KEY
        );

        /*
        |--------------------------------------------------------------------------
        | Activate guest
        |--------------------------------------------------------------------------
        */

        dispatch({
          type: ACTIONS.GUEST_MODE,
          payload: guestUser,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Guest mode error:',
          error
        );

        return {
          success: false,

          error:
            'Unable to start guest mode.',
        };
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = useCallback(
    async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | Remove guest session
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.removeItem(
          GUEST_STORAGE_KEY
        );

        /*
        |--------------------------------------------------------------------------
        | Remove active registered session
        |--------------------------------------------------------------------------
        */

        await AsyncStorage.removeItem(
          STORAGE_KEY
        );

        /*
        |--------------------------------------------------------------------------
        | Reset runtime state
        |--------------------------------------------------------------------------
        */

        dispatch({
          type: ACTIONS.LOGOUT,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Logout error:',
          error
        );

        return {
          success: false,
        };
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | UPDATE USER
  |--------------------------------------------------------------------------
  */

  const updateUser = useCallback(
    async (updatedUser) => {
      try {
        if (!updatedUser) {
          return {
            success: false,
          };
        }

        const normalisedUser =
          normaliseUser({
            ...updatedUser,

            isGuest:
              state.isGuest ||
              updatedUser.isGuest ||
              false,
          });

        /*
        |--------------------------------------------------------------------------
        | Update local state
        |--------------------------------------------------------------------------
        */

        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: normalisedUser,
        });

        /*
        |--------------------------------------------------------------------------
        | Guest
        |--------------------------------------------------------------------------
        |
        | Guests never touch Firestore.
        |--------------------------------------------------------------------------
        */

        if (
          state.isGuest ||
          normalisedUser.isGuest
        ) {
          await AsyncStorage.setItem(
            GUEST_STORAGE_KEY,
            JSON.stringify(
              normalisedUser
            )
          );

          /*
          | Restore guest flag because LOGIN_SUCCESS
          | represents a registered login.
          */

          dispatch({
            type: ACTIONS.GUEST_MODE,
            payload: normalisedUser,
          });

          return {
            success: true,
          };
        }

        /*
        |--------------------------------------------------------------------------
        | Registered user
        |--------------------------------------------------------------------------
        */

        if (normalisedUser.id) {
          await updateLeaderboardUser(
            normalisedUser
          );
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error(
          'Failed to update user:',
          error
        );

        return {
          success: false,
          error:
            'Failed to update user.',
        };
      }
    },
    [state.isGuest]
  );

  /*
  |--------------------------------------------------------------------------
  | POINTS
  |--------------------------------------------------------------------------
  */

  const updatePoints = useCallback(
    (pointsToAdd) => {
      dispatch({
        type: ACTIONS.UPDATE_POINTS,
        payload: pointsToAdd,
      });
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | PREP COINS
  |--------------------------------------------------------------------------
  */

  const spendPrepCoins = useCallback(
    (amount) => {
      dispatch({
        type: ACTIONS.SPEND_PREP_COINS,
        payload: amount,
      });
    },
    []
  );

  const addPrepCoins = useCallback(
    (amount) => {
      dispatch({
        type: ACTIONS.ADD_PREP_COINS,
        payload: amount,
      });
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | INVENTORY
  |--------------------------------------------------------------------------
  */

  const addInventoryItem = useCallback(
    (item) => {
      dispatch({
        type: ACTIONS.ADD_INVENTORY_ITEM,
        payload: item,
      });
    },
    []
  );

  const removeInventoryItem =
    useCallback((itemId) => {
      dispatch({
        type:
          ACTIONS.REMOVE_INVENTORY_ITEM,

        payload: itemId,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | BADGES
  |--------------------------------------------------------------------------
  */

  const addBadge = useCallback(
    (badge) => {
      dispatch({
        type: ACTIONS.ADD_BADGE,
        payload: badge,
      });
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | THEME
  |--------------------------------------------------------------------------
  */

  const setTheme = useCallback(
    (theme) => {
      dispatch({
        type: ACTIONS.SET_THEME,
        payload: theme,
      });
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | ONBOARDING
  |--------------------------------------------------------------------------
  */

  const completeOnboarding =
    useCallback((streakType) => {
      dispatch({
        type:
          ACTIONS.COMPLETE_ONBOARDING,

        payload: {
          streakType,
        },
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | HEALTH DATA
  |--------------------------------------------------------------------------
  */

  const updateHealthData =
    useCallback((healthData) => {
      dispatch({
        type:
          ACTIONS.UPDATE_HEALTH_DATA,

        payload: healthData,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | FAMILY MEMBERS
  |--------------------------------------------------------------------------
  */

  const updateFamilyMembers =
    useCallback((members) => {
      dispatch({
        type:
          ACTIONS.UPDATE_FAMILY_MEMBERS,

        payload: members,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | FAMILY EMERGENCY PLAN
  |--------------------------------------------------------------------------
  */

  const updateFamilyEmergencyPlanStatus =
    useCallback((status) => {
      dispatch({
        type:
          ACTIONS.UPDATE_FAMILY_EMERGENCY_PLAN_STATUS,

        payload: status,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | QUIZZES
  |--------------------------------------------------------------------------
  */

  const updateCompletedQuizzes =
    useCallback((quizzes) => {
      dispatch({
        type:
          ACTIONS.UPDATE_COMPLETED_QUIZZES,

        payload: quizzes,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | MISSIONS
  |--------------------------------------------------------------------------
  */

  const updateCompletedMissions =
    useCallback((missions) => {
      dispatch({
        type:
          ACTIONS.UPDATE_COMPLETED_MISSIONS,

        payload: missions,
      });
    }, []);

  const addCompletedMission =
    useCallback((missionId) => {
      dispatch({
        type:
          ACTIONS.ADD_COMPLETED_MISSION,

        payload: missionId,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | STREAK
  |--------------------------------------------------------------------------
  */

  const updateStreak =
    useCallback((streak) => {
      dispatch({
        type: ACTIONS.UPDATE_STREAK,

        payload: streak,
      });
    }, []);

  /*
  |--------------------------------------------------------------------------
  | CONTEXT VALUE
  |--------------------------------------------------------------------------
  */

  const contextValue = {
    ...state,

    /*
    | Authentication
    */

    login,

    signup,

    logout,

    guestMode,

    /*
    | User
    */

    updateUser,

    /*
    | Progress
    */

    updatePoints,

    addBadge,

    completeOnboarding,

    updateStreak,

    /*
    | Coins
    */

    spendPrepCoins,

    addPrepCoins,

    /*
    | Inventory
    */

    addInventoryItem,

    removeInventoryItem,

    /*
    | Health
    */

    updateHealthData,

    /*
    | Family
    */

    updateFamilyMembers,

    updateFamilyEmergencyPlanStatus,

    /*
    | Quizzes
    */

    updateCompletedQuizzes,

    /*
    | Missions
    */

    updateCompletedMissions,

    addCompletedMission,

    /*
    | Theme
    */

    setTheme,

    /*
    | Validation
    */

    validateEmail,

    validatePassword,

    validateName,
  };

  return (
    <UserContext.Provider
      value={contextValue}
    >
      {children}
    </UserContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

export const useUser = () => {
  const context =
    useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser must be used within UserProvider'
    );
  }

  return context;
};