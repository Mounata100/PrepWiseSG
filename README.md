# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).



# PrepWiseSG
## Project Overview

PrepWiseSG is a mobile application developed to support disaster preparedness and response in Singapore, with a focus on climate-related hazards. The application combines real-time environmental information with preparedness activities and gamification to encourage users to develop practical emergency readiness.

The application provides users with information and tools that can be used both before and during an emergency. These include environmental monitoring, emergency alerts, location-based information, preparedness checklists, quizzes, response guidance, and access to local resources.

## Background

Climate change has increased the importance of preparing for climate-related hazards and emergency situations. However, users may not always have access to practical and personalised guidance that helps them understand how to prepare before an incident or respond appropriately when one occurs.

PrepWiseSG addresses this by combining preparedness education with real-time mobile functionality. Instead of presenting preparedness information as static material, the application uses missions, quizzes, progress tracking, achievements, and other gamification elements to encourage continued participation. It is designed specifically for the Singapore context and incorporates local environmental data and resources where appropriate.

## Objectives

The primary objective of PrepWiseSG is to improve individual preparedness for climate-related disasters in Singapore. The application aims to encourage users to complete practical preparedness activities, improve their understanding of emergency procedures, and remain aware of relevant environmental conditions.

A secondary objective is to provide users with useful information during emergency situations. This includes location-based information, environmental alerts, response guidance, and access to relevant local resources.

## Application Features

PrepWiseSG includes a preparedness system through which users can complete activities such as emergency checklists, Go-Bag preparation, quizzes, missions, and family preparedness tasks. Completion of these activities contributes to the user's progress within the application.

Gamification is used as an engagement mechanism throughout the application. Users can earn achievements, maintain activity streaks, progress through levels, participate in leaderboards, and receive rewards based on their completed activities. These features are intended to encourage users to engage with preparedness regularly rather than only during an emergency.

The application also integrates environmental data from sources including the Singapore National Environment Agency, Singapore Open Data, and Open-Meteo. This information is used to provide users with current environmental conditions and support the application's alert functionality.

Location services are incorporated to provide information relevant to the user's location. The application also includes emergency mapping, distance calculations, and location-based information to support users during emergency situations.

Push notifications are implemented using Expo Notifications to allow relevant alerts and information to be presented to users without requiring the application to remain open.

## System Architecture

PrepWiseSG is developed using React Native and Expo. The application follows a modular structure in which user interfaces, application state, navigation, external services, and utility functions are separated into their respective modules.

React Context is used to manage major areas of application state. UserContext manages user-related information and progress, GameContext manages gamification features, and AlertContext manages environmental and emergency alert information.

External services are handled through dedicated service modules. These include modules for NEA data, Open-Meteo, Firebase, location services, notifications, and alert processing. This separation allows API and service logic to remain independent from individual application screens.

## Technology Stack

The application is developed using React Native, Expo, JavaScript, React Navigation, and the React Context API. Firebase is used for application backend functionality and authentication. External REST APIs provide environmental and weather information, while Expo Notifications and device location services provide access to relevant mobile capabilities.

## Project Structure
PrepWiseSG/
│
├── App.js
├── app.json
├── index.js
├── package.json
│
├── assets/
├── components/
├── contexts/
├── firebase/
├── navigation/
├── screens/
├── services/
└── utility/


The screens directory contains the application's primary user interfaces, while components contains reusable interface components. The contexts directory manages shared application state, and navigation contains the navigation structure. External API and device integrations are located within services, while reusable calculations and supporting functions are contained within utility.

## Installation

The application requires Node.js, npm, and an Expo development environment.

After cloning the repository, install the project dependencies:

### npm install


Start the development server using:

### npx expo start


The application can be run through Expo Go or an appropriate Android or iOS development environment.

## Security

Application credentials and sensitive configuration should not be committed to version control. Private API keys, service-account credentials, passwords, authentication tokens, and private keys should be stored separately from the source code.

Firebase configuration and access controls should be configured according to the requirements of the deployed application.

## Project Objective

PrepWiseSG is intended to provide a single mobile platform for both disaster preparedness and emergency response. The project combines practical preparedness activities with gamification to encourage user participation, while real-time environmental information and location-based functionality provide support during changing conditions.

The overall purpose of the application is to make disaster preparedness more accessible and actionable for users in Singapore while encouraging preparedness as an ongoing activity rather than a response that begins only after an emergency has occurred.

## Project Status

PrepWiseSG is currently under development. Application features, interfaces, and external service integrations may be revised during development and testing.