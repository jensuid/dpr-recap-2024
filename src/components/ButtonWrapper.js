
import React, { useState } from "react";
import { SelectButton } from 'primereact/selectbutton';

export default function ButtonWrapper() {
    const options = ['Nasional', 'Dapil','Wilayah'];
    const [value, setValue] = useState(options[0]);

    return (
        <div className="card flex justify-content-center">
            <SelectButton value={value} onChange={(e) => {setValue(e.value);console.log(e.value)}} options={options} />
        </div>
    );
}
        