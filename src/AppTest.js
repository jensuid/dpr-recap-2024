
//import { useEffect } from 'react';
//import SelectInput from '@mui/material/Select/SelectInput';
import './App.css';
// import rekap_dpr from "./db/rekap-dpr.json";
//import dapil_dpr from "./db/dapil-dpr.json";
//import './components/BasicDemo';
//import BasicDemo from './components/BasicDemo';
import SelectWrapper from './components/SelectWrapper';
import ButtonWrapper from './components/ButtonWrapper';




function AppTest() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Recapitulation DPR election</h1>
      </header>
      <SelectWrapper/>
      {/* <ButtonWrapper/> */}

    </div>
  );
}

export default AppTest;
