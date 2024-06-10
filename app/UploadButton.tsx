import React from 'react';
import { Button } from '@mui/material';

function UploadButton() {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // Aquí puedes manejar el archivo seleccionado, por ejemplo, subirlo a un servidor o mostrar una vista previa
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-photo"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="upload-photo">
        <Button variant="contained" component="span" sx={{marginBottom: '15%'}}>
          Subir Foto
        </Button>
      </label>
    </div>
  );
}

export default UploadButton;
