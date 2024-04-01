import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import dapil_dpr_db from '../db/dapil-dpr.json'



export default function SelectWrapper() {
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [selectedArea, setSelectedArea] = useState('');

    const nasionalTarget = { nama_dapil : "NASIONAL",
                            kode_dapil : '0000'};

    const AreaSelector = (selectedArea === 'Dapil') ? 
                        <DSelect  value={selectedTarget} onChange={(e) => {setSelectedTarget(e.value);}}/> : null;
       
    const Panel = selectedTarget ? <h3>Target : {selectedTarget.nama_dapil} {'  '} [{selectedTarget.kode_dapil}]</h3> :
          <h3>Target : No Selection</h3>;

    return (
        <div className="select-wraper">
            {Panel}
            <MultiButton value={selectedArea} onChange={(e) => {setSelectedArea(e.value);
                         if (e.value === 'Nasional') {setSelectedTarget(nasionalTarget)} else {setSelectedTarget(null)}}}/>
            {AreaSelector}
        </div>
    )
};

export function DSelect({value,onChange}){
   
    const dapil_dpr = dapil_dpr_db.map(value => {return {kode_dapil : value.kode_dapil, nama_dapil : value.nama_dapil}});
    return (
        <Dropdown id="dropdown" value={value} onChange={onChange} options={dapil_dpr}  optionLabel="nama_dapil" 
                placeholder="Select Dapil" className="w-full md:w-14rem" />
    )
};

export  function MultiButton({value,onChange}) {
    const options = ['Nasional', 'Dapil'];

    return (
        <div className="card flex justify-content-center">
            <SelectButton value={value} onChange={onChange} options={options} />
        </div>
    );
}
       