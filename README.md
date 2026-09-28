# PrepWiseSG

## Developing a Mobile App for Local Disaster Preparedness and Response

PrepWiseSG is a React Native mobile application developed to support disaster preparedness and response in Singapore, with a particular focus on climate-related hazards such as floods, haze and extreme heat.

The application combines interactive preparedness education, gamification, environmental information, emergency resources, location-based functionality and household communication features.

Rather than presenting emergency preparedness as predominantly passive information consumption, PrepWiseSG encourages users to repeatedly practise preparedness through missions, checklists, interactive games, progression, rewards and other gamified activities.

## Project Objectives

PrepWiseSG aims to encourage proactive disaster preparedness before an emergency occurs.

The application aims to:

- Improve users' knowledge of emergency preparedness.
- Encourage users to practise preparedness during non-emergency periods.
- Make preparedness activities more engaging through gamification.
- Provide practical and actionable preparedness activities.
- Provide environmental information relevant to Singapore.
- Provide location-relevant environmental information.
- Provide emergency resources and response guidance.
- Support household communication during emergencies.
- Encourage repeated interaction through missions, progression and rewards.

## Problem Addressed

Emergency preparedness information is widely available, but users may not regularly interact with or practise this information before an emergency occurs.

This creates a temporal disconnect between emergency information being available and users being prepared to apply that information when an emergency occurs.

PrepWiseSG addresses this by combining preparedness education with interactive mobile functionality.

Users can:

- Complete preparedness checklists.
- Complete daily preparedness activities.
- Build an emergency Go-Bag.
- Complete interactive preparedness games.
- Progress through missions.
- Earn XP and PrepPoints.
- Unlock new mission areas and levels.
- Maintain preparedness streaks.
- View achievements and progression.
- Redeem available rewards through the Voucher screen.
- View environmental information.
- Receive relevant notifications.
- Access emergency resources.
- Coordinate with household members through Family Safe.

## Main Features

### Home Screen

The Home Screen acts as the main interface for preparedness activity.

It provides access to:

- Current XP.
- User level.
- PrepPoints / coins.
- Preparedness streak.
- Daily preparedness activities.
- Mission progression.
- Available activities.
- Environmental and emergency information.

The Home Screen provides a central starting point for accessing the application's preparedness features.

### Interactive Mission Map

PrepWiseSG uses a progressive mission map to organise preparedness activities.

Mission areas are progressively unlocked as users complete previous activities. This provides a structured progression rather than making all learning activities immediately available.

The mission map includes:

- Progressive area unlocking.
- Mission progression.
- Locked and unlocked activities.
- Completion states.
- XP rewards.
- PrepPoints / coin rewards.
- Multiple preparedness topics.

The progressive structure was introduced to encourage users to return to the application instead of completing all available learning content in one session.

### Gamification System

Gamification is integrated throughout the application to encourage continued participation.

Users can earn:

- XP.
- Levels.
- PrepPoints / coins.
- Badges.
- Streaks.
- Mission progress.
- Rewards.

Completing preparedness activities contributes to the user's progression.

The gamification system is designed to turn preparedness from a one-time information activity into shorter, repeatable interactions.

### Interactive Games

PrepWiseSG contains three main preparedness games.

Each game contains three levels, with later levels progressively unlocked as users advance.

The games provide interactive scenarios where users practise making preparedness decisions.

The games cover areas including:

- Flood preparedness.
- Climate-related hazards.
- Emergency supplies and response preparedness.

The game system includes reusable logic for:

- Scenario configuration.
- Scoring.
- Level progression.
- Item selection.
- Timed interactions.
- Feedback.
- XP rewards.
- Completion tracking.

### Preparedness Checklists

The application includes preparedness checklists that allow users to convert general preparedness recommendations into practical actions.

Users can review and complete checklist activities relating to emergency readiness.

Checklist completion can contribute to application progression and rewards.

### Daily Preparedness Activities

PrepWiseSG provides recurring preparedness activities to encourage users to interact with the application during normal, non-emergency periods.

Activities may include:

- Emergency scenarios.
- Preparedness questions.
- Safety actions.
- Checklist activities.
- Missions.

Completed activities can contribute to XP, progression and rewards.

### Go-Bag Builder

The Go-Bag Builder allows users to practise selecting appropriate items for an emergency Go-Bag.

Users select items and submit their selection. The application then evaluates the selection and provides feedback and rewards.

This feature allows users to practise identifying useful emergency supplies rather than only reading preparedness recommendations.

### Voucher Screen

The Voucher screen provides a reward redemption mechanism.

Users can view available rewards and redeem eligible vouchers using accumulated PrepPoints or other supported application rewards.

This provides an additional purpose for earning PrepPoints through preparedness activities.

### Leaderboard

PrepWiseSG includes a leaderboard that allows users to view their progression relative to other users.

The cloud-enabled leaderboard can use Firebase Cloud Firestore to synchronise user progression.

The leaderboard can display information such as:

- XP.
- User progression.
- Ranking.
- Community preparedness progress.

Firebase configuration is required for cloud-synchronised leaderboard functionality.

The core application remains usable without Firebase. If Firebase is not configured, features that depend on cloud synchronisation, such as the shared leaderboard and certain synchronised user updates, may not be available.

### Environmental Alerts

PrepWiseSG integrates environmental information relevant to Singapore.

Environmental information can include:

- Temperature.
- Rainfall.
- Weather conditions.
- PM2.5 information.
- Haze-related information.
- Other environmental indicators.

The application processes information retrieved from external services before presenting it to the user.

### Environmental APIs

PrepWiseSG integrates external environmental services including:

- Open-Meteo.
- Singapore Open Data / data.gov.sg.
- Relevant environmental data services.

The API layer includes validation and error handling so that a temporary failure of one external service does not necessarily prevent the rest of the application from operating.

### Location Services

Location services are used to provide location-relevant environmental information.

When permission is granted, the application can use the user's current coordinates.

If location permission is not granted, Singapore reference coordinates are used as a fallback for relevant environmental requests.

Therefore, location permission is not required for the application to provide Singapore-focused environmental information.

### Emergency Resources

PrepWiseSG provides access to emergency-related resources and local information.

These resources are intended to provide preparedness guidance and support users in identifying appropriate actions and sources of assistance.

The application is designed to complement official emergency information rather than replace official instructions.

### Health QR

The Health QR feature allows users to create an emergency medical information profile.

The prototype stores the profile locally using AsyncStorage so that the information remains accessible on the device without requiring an internet connection.

The profile may contain information such as:

- Blood type.
- Allergies.
- Medications.
- Medical conditions.
- Emergency contact information.

The current Health QR feature is implemented as a prototype. A production deployment would require additional security, authentication, access-control and verification mechanisms for the complete QR scanning and information-sharing workflow.

### Family Safe

Family Safe provides household communication and coordination functionality.

Firebase Cloud Firestore can be used to synchronise family groups and messages between authorised users.

Recently accessed information can also be cached locally to improve resilience during temporary network interruptions.

Family Safe can support:

- Household communication.
- Safety updates.
- Family status information.
- Emergency coordination.
- Evacuation coordination.

### Notifications

PrepWiseSG uses Expo Notifications for application notifications.

Notifications may be used for:

- Preparedness activities.
- Environmental information.
- Relevant application events.
- Emergency-related information where implemented.

Notification functionality depends on device permissions, operating-system settings, network availability and the configured notification services.

### Multilingual Support

PrepWiseSG supports four languages:

- English.
- Chinese.
- Malay.
- Tamil.

The language can be changed from the Settings screen.

### Dark Mode

The application supports both light and dark appearance modes.

Users can switch between the two modes from the Settings screen.

### Settings and Account Management

The Settings screen provides application and user configuration options.

Users can:

- Switch between light and dark mode.
- Change their display name.
- Change the application language.
- Access account security settings.

## Technology Stack

PrepWiseSG is developed using:

- React Native
- Expo
- JavaScript
- React Navigation
- React Context API
- Firebase Authentication
- Firebase Cloud Firestore
- AsyncStorage
- Expo Notifications
- Device location services
- Open-Meteo API
- Singapore Open Data / data.gov.sg APIs
- Jest
- React Native Testing Library

## Application Architecture

PrepWiseSG follows a modular React Native architecture.

The application separates user interfaces, reusable components, application state, navigation, external services, API integrations and utility functions.

React Context is used for major areas of shared application state.

### UserContext

UserContext manages user-related information and progression, including:

- User profile information.
- XP.
- Levels.
- Streaks.
- User preferences.
- User progression.

### GameContext

GameContext manages gamification and game-related state, including:

- Mission progression.
- Game state.
- XP rewards.
- Badges.
- Levels.
- Game completion.
- Preparedness activities.

### AlertContext

AlertContext manages environmental and emergency information, including:

- Environmental API information.
- Alert states.
- Location information.
- Environmental indicators.
- API refresh states.

## Data Storage

PrepWiseSG uses a combination of local and cloud-based storage.

### AsyncStorage

AsyncStorage is used for device-specific information and data that should remain available when network connectivity is unavailable.

Examples include:

- Local preferences.
- Application settings.
- Cached information.
- Onboarding state.
- Local preparedness information.
- Health QR information.
- Cached Family Safe information where applicable.

### Firebase

Firebase provides cloud functionality for features requiring synchronisation between users or devices.

Firebase Authentication can provide user authentication, while Cloud Firestore can provide cloud-based storage for information such as:

- User profiles.
- XP and progression.
- Achievements.
- Leaderboard records.
- Family Safe information.

Firebase is optional for basic application exploration. Without Firebase configuration, the main application and locally supported features can still be used, while cloud-dependent functionality may be unavailable.

## Environmental Data and Location Fallback

PrepWiseSG retrieves environmental information through external APIs.

When location permission is available, the user's coordinates can be used to request location-relevant information.

If location permission is unavailable, Singapore reference coordinates are used instead.

This allows the environmental features to continue providing Singapore-focused information without requiring the user to share their device location.

External API requests include error handling and fallback behaviour to reduce the effect of temporary network or service failures.

## Installation

### Requirements

Before running PrepWiseSG, install:

- Node.js
- npm
- Expo CLI / Expo development tools
- Git

For mobile testing, one of the following is required:

- Expo Go on a physical Android or iOS device.
- Android Studio and an Android emulator.
- Xcode and an iOS simulator on macOS.

### Clone the Repository

Clone the public GitHub repository:

git clone <YOUR-GITHUB-REPOSITORY-URL>
Navigate into the project directory:

cd PrepWiseSG

Install Dependencies
Install the required npm packages:

npm install

Start the Expo Development Server
Start the application using:

npx expo start

Expo will display a QR code and development options in the terminal or browser.

Running with Expo Go
Expo Go provides the simplest way to test the application on a physical device.

Install Expo Go on the Android or iOS device.

Connect the device and development computer to the same network.

Run:

npx expo start

Scan the QR code using the appropriate device functionality.

Open the project in Expo Go.

Some device-specific functionality may behave differently in Expo Go depending on the installed Expo SDK, operating system and native configuration.

Running on Android
Android Emulator
Install Android Studio and configure an Android emulator.

Start the emulator and run:

npx expo start

Then select the Android option from the Expo development interface.

Alternatively:

npx expo start --android

Android Development Build
For a development build, configure the required Android environment and use the Expo/EAS build process appropriate to the project's configuration.

For example:

npx expo run:android

This requires the Android development environment to be installed and configured correctly.

Running on iOS
iOS development and local native builds require macOS with Xcode.

Start the Expo development server:

npx expo start

For an iOS simulator:

npx expo start --ios

For a native iOS development build:

npx expo run:ios

An Apple Developer account and appropriate signing configuration are required for installing builds on physical iOS devices.

Firebase Configuration
Firebase is used for cloud-based functionality such as authentication, synchronised user data, the leaderboard and Family Safe.

The Firebase configuration file containing the project's environment-specific credentials is not included in the public repository.

Create the required local environment/configuration file according to the Firebase configuration used by the project.

Do not commit private credentials, service-account keys, passwords or other sensitive configuration to GitHub.

If Firebase is not configured, the application can still be launched and the locally supported features can be explored. Cloud-dependent features such as the shared leaderboard and synchronised user data may not function.

Evaluators who require the complete cloud-enabled functionality should configure their own Firebase project and provide their own Firebase configuration.

Firebase Setup
To enable the Firebase-dependent features:

Create a Firebase project.

Enable Firebase Authentication if authentication is required.

Enable Cloud Firestore.

Configure the Firestore security rules required by the application.

Register the application with Firebase.

Add the Firebase configuration to the local project configuration.

Start the application again.

The exact Firebase configuration should match the Firebase setup expected by the source code.

Firebase credentials should be kept outside the public repository where appropriate.

API Configuration
PrepWiseSG uses external APIs for environmental information.

The application integrates services including Open-Meteo and Singapore Open Data / data.gov.sg.

Where an API does not require a private key, no additional credential may be required.

Where credentials are required by a particular deployment, they should be configured locally and should not be committed to the public repository.

Running Without Firebase
Firebase is not required to launch the basic application.

Evaluators can install the dependencies and start the application using:

npm install
npx expo start

The locally supported features can then be explored.

Without Firebase configuration, some cloud-dependent functionality may not be available, including:

Shared leaderboard synchronisation.

Cloud-synchronised user progression.

Firebase authentication-dependent functionality.

Family Safe cloud synchronisation.

The remainder of the application can still be used to explore the main preparedness, gamification, checklist, game, environmental and interface features.

Recommended Evaluation Flow
For an evaluator exploring the application, the following sequence provides an overview of the main functionality:

Launch PrepWiseSG.

Complete or review the onboarding process.

Open the Home Screen.

Review XP, level, PrepPoints, streak and preparedness activities.

Complete the Daily Preparedness Activity.

Open and complete the preparedness checklist.

Open the Mission Map.

Begin the available mission.

Complete the first level of a game.

Continue to unlock subsequent levels.

Complete the Go-Bag Builder.

Open FloodRunner.

Open Climate Defence.

Review XP and progression after completing activities.

Open the Voucher screen and review available rewards.

Open the Leaderboard if Firebase has been configured.

Open the Alerts screen and review environmental information.

Test the application without granting location permission to observe the Singapore-coordinate fallback.

Open Settings and test language switching.

Test Dark Mode.

Review Health QR.

Review Family Safe if Firebase has been configured.

Testing
PrepWiseSG was tested using automated software testing and application-level testing.

Jest was used to test core application logic and React Native components.

Testing includes:

Unit Testing
Unit tests verify individual functions and modules such as:

XP calculations.

Badge validation.

Streak logic.

Mission progression.

API processing.

Game logic.

Edge cases are also considered where appropriate.

Component Testing
React Native Testing Library is used to test application components and user interactions.

Examples include:

Rendering of progress indicators.

Badge display.

Alert components.

Quiz selections.

Button interactions.

Game interactions.

Integration Testing
Integration testing verifies that multiple application components work together.

Examples include:

Completing a mission and receiving XP.

Unlocking a badge.

Updating progression.

Processing environmental information.

Updating leaderboard information.

Interaction between application contexts and screens.

Evaluation Approach
The project evaluates PrepWiseSG across four main areas:

Functionality
The application is evaluated based on whether its core features operate according to their intended requirements.

This includes:

Navigation.

Gamification.

Mission progression.

Games.

Checklists.

Environmental APIs.

Notifications.

Data persistence.

Supporting features.

Usability
Usability is evaluated through user feedback and questionnaire responses.

Areas include:

Ease of navigation.

Clarity of instructions.

Interface layout.

Ability to find features.

Feedback provided by activities.

Overall ease of use.

Educational Value
Educational value is evaluated using preparedness questions before and after interaction with the application.

The evaluation considers whether users demonstrate changes in preparedness knowledge after completing the application's learning activities.

Engagement
Engagement is evaluated through questionnaire responses and application interaction.

Relevant indicators include:

Mission completion.

Game participation.

XP progression.

Streak activity.

Reward interaction.

Willingness to reuse the application.

Evaluation Limitations
The human evaluation is separate from the technical testing of the application.

Technical tests can establish whether individual software functions operate as expected, but they cannot independently demonstrate that the application improves users' preparedness behaviour or knowledge.

User evaluation is therefore required to assess educational value, usability and engagement.

Where the number of participants is limited, evaluation results should be interpreted as preliminary rather than generalisable to the wider population.

Privacy and Security Considerations
The application handles different types of user information depending on the feature being used.

Local information such as Health QR data is designed to remain on the device in the current prototype implementation.

Cloud-based features use Firebase services where synchronisation is required.

Sensitive configuration such as:

Firebase service credentials.

Private API keys.

Authentication tokens.

Passwords.

Private keys.

must not be committed to the public repository.

The Health QR feature should also be treated as a prototype emergency-information mechanism rather than a production medical-record system. A production deployment would require additional security controls, secure verification and appropriate privacy protections.

Project Status
PrepWiseSG is a functional cross-platform prototype approaching deployment readiness.

The major application features have been implemented, including:

Gamified preparedness learning.

Progressive mission map.

Three interactive games with three levels each.

Preparedness checklists.

Daily preparedness activities.

Go-Bag Builder.

XP and level progression.

PrepPoints / rewards.

Voucher redemption.

Streaks.

Leaderboard functionality.

Environmental APIs.

Location services and Singapore coordinate fallback.

Emergency resources.

Health QR.

Family Safe.

Notifications.

Multilingual support.

Dark Mode.

Firebase cloud synchronisation.

Some features depend on external services and configuration. In particular, Firebase-dependent functionality requires an appropriately configured Firebase project.

Future Development
Potential future development includes:

1) Larger-scale user evaluation.

2) Longitudinal evaluation of repeated engagement.

3) Further refinement of gamification mechanics.

4) Additional preparedness scenarios.

5) Expanded accessibility support.

6) Additional language localisation.

7) Further security improvements for Health QR.

8) More comprehensive emergency information sharing.

9) Additional environmental data sources.

10) Further optimisation for production deployment.

## Project Purpose
PrepWiseSG is intended to provide a single mobile platform that combines disaster preparedness education with emergency-related mobile functionality.
The application shifts preparedness from predominantly passive information consumption towards interactive and repeatable activities.
Through missions, games, checklists, rewards and progression, users can practise preparedness during normal periods. Environmental information, alerts, emergency resources and household communication features then provide additional support when conditions change.
The project therefore provides a technical foundation for a more proactive approach to disaster preparedness in Singapore.
