
//import { useEffect } from 'react';
import './App.css';
import './components/ColorToggleButton'
// import rekap_dpr from "./db/rekap-dpr.json";
//import dapil_dpr from "./db/dapil-dpr.json";
import ColorToggleButton from './components/ColorToggleButton';
import BasicSelect from './components/BasicSelect';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Recapitulation DPR election</h1>
      </header>
       <ColorToggleButton/>
       {/* <BasicSelect/> */}
    </div>
  );
}

export default App;
