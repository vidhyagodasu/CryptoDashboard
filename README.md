# Drag-and-Drop Data Visualization Dashboard

## Setup Instructions
**Install node from the official node.js website (https://nodejs.org)**

1. Clone the repository:
   ```sh
    git clone  https://github.com/vidhyagodasu/CryptoDashboard
    ```
   ```sh
   cd CryptoDashboard
   ```
   
   **OR**

   i. Click on 'Download Zip' from the <>Code Option
   
   ii. Extract the Zip file
   
   iii. Open that folder in a Code Editor

3. Install dependencies:
   ```sh
   npm install
   ```
5. Start the development server:
   ```sh
   npm start
   ```

## Overview
This project is a Drag-and-Drop Data Visualization Dashboard built with React.js. 

## Key Features
1. **Data Loading and State Management**
    - Fetches cryptocurrency data from the CoinGecko API.
    - Uses Redux for state management.
    - Polls the API every 5 seconds for real-time updates.

2. **Dynamic and Configurable Dashboard**
    - Implements drag-and-drop functionality using `react-beautiful-dnd`.
    - Saves layout configuration in local storage.

3. **Responsive Design**
    - Ensures the dashboard is fully responsive.
    - Automatically adjusts layout when components are deleted.

## Additional Features
1. **Provided a Search Bar to Search for User required Crypto Currency Information**

2. **Provided an option to toggle between Line Chart and Bar Chart**

## Limitations
1. Polled the end point for every 500 seconds instead of 5 seconds as polling for every 5 seconds raising a network error
   
