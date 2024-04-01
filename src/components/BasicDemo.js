
import React, { useState } from "react";
import { Dropdown } from 'primereact/dropdown';

export default function BasicDemo() {
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    //console.log('city : ',selectedCity);

    return (
        <div className="card flex justify-content-center">
            <Dropdown id="dropdown" value={selectedCity} onChange={(e) => {setSelectedCity(e.value); console.log(e.value,e)}} options={cities} optionValue="code" optionLabel="name" 
                placeholder="Select a City" className="w-full md:w-14rem" />
        </div>
    )
}
        