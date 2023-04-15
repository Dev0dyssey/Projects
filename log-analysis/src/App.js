import logo from "./logo.svg";
import "./App.css";
import DataAnalysis from "./DataAnalysis";

const data = [
  {
    timestamp: "2023-04-11T16:56:14.826Z",
    UUID: "1a70da81-1ef1-4313-9f71-53b732d4379c",
    type: "ERROR",
    sourceCodeLocation: "Error0039",
    currentURL: "/",
    message: "Error: File does not exist",
    memoryUsedMB: 13.924072265625,
    storageAvailableMB: 4012.25390625,
  },
  {
    timestamp: "2023-04-11T16:56:15.116Z",
    UUID: "ccff8c42-4943-4c5c-9e7e-b217a0f51c4a",
    type: "ERROR",
    sourceCodeLocation: "Error0039",
    currentURL: "/",
    message: "Error: File does not exist",
    memoryUsedMB: 13.924072265625,
    storageAvailableMB: 4012.25390625,
  },
  {
    timestamp: "2023-04-11T16:56:14.826Z",
    UUID: "1a70da81-1ef1-4313-9f71-53b732d4379c",
    type: "ERROR",
    sourceCodeLocation: "Error0039",
    currentURL: "/",
    message: "Error: File does not exist",
    memoryUsedMB: 13.924072265625,
    storageAvailableMB: 4012.25390625,
  },
  {
    timestamp: "2023-04-11T16:56:14.822Z",
    UUID: "33f6a97b-4dd2-40d3-a007-0a6996e6fddf",
    type: "ERROR",
    sourceCodeLocation: "Error0039",
    currentURL: "/",
    message: "Error: File does not exist",
    memoryUsedMB: 13.861572265625,
    storageAvailableMB: 4012.25390625,
  },
  // Add more data objects here...
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <DataAnalysis data={data} />
    </div>
  );
}

export default App;
