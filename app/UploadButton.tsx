import React from 'react';
import { Button } from '@mui/material';
//import * as fs from 'fs';
//import * as path from 'path';
import FormData from 'form-data';

function UploadButton() {
    const handleFileChange = (event: any) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file);

            //const exampleFile = fs.createReadStream(path.join(__dirname, "./avatar"));

            const form = new FormData();
            form.append("avatar", file);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: form as any // Cast to any to bypass TypeScript type checking for fetch body
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Avatar uploaded: ", data);
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                });
        }
    }

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
                <Button variant="contained" component="span" sx={{ marginBottom: '15%' }}>
                    Subir Foto
                </Button>
            </label>
        </div>
    );
}

export default UploadButton;
