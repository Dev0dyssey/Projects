# Connex One API and Frontend technical tas

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
This projects uses Express for a local server

## To run the project
- Clone the repo from GitHub
- NPM install
- Navigate to **/server** folder and run node `index.js` to start the Express server
- Run NPM start from the root folder of the project (**connex-epoch-api**) to start the React App


## Additional steps to improve code and performace
- I have encountered a likely race condition when querying the server and client time, causing the time difference logic to not fire consistently. Would probably look at adding conditional logic to ensure that both server and client time are set before running the time difference calculation
- Wider and better test coverage. I have run out of time when writing the unit tests, leaving them unfinished. If given more time I would look into completing unit tests for both the frontend and backend, ensuring good code coverage. Focus would be on the key aspects of the code logic
- Easier way to start up the application. Currently a terminal command needs to be run from two location (server and React app). Would like to write an executable script that would spin up both instances in a single command
- Ensure the Application UI displays well on mobile devices. CSS does take advantage of the fexbox approach, but did not manage to do full mobile testing before the time limit
- Possibly look at making the application code more modular, to allow other engineers to use parts of the codebase if they like part of the logic

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

