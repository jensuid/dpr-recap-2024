import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dapil_dpr_db from '../db/dapil-dpr.json'

const dapil_dpr = Object.entries(dapil_dpr_db).map(([key,value]) => 
     [value.kode_dapil,value.nama_dapil]
);


export default function BasicSelect() {
  const [dapil, setDapil] = React.useState('3101');

  const handleChange = (event) => {
    setDapil(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Dapil</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={dapil}
          label="Dapil"
          onChange={handleChange}
        >  
        {dapil_dpr.map((area) =>
            (<MenuItem key={area[0]} value={area[0]}>{area[1]}</MenuItem>))}

        </Select>
      </FormControl>
    </Box>
  );
};