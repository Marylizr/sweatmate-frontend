import React, { useRef } from 'react';

const Upload = ({addPhoto}) => {
    const inputFile = useRef(null);

    const onSubmit = () => {
        
        const files = inputFile.current.files;
        const formData = new FormData();
        const url = "https://api.cloudinary.com/v1_1/da6il8qmv/image/upload";
      
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          formData.append("file", file);
          formData.append("upload_preset", "kam3rrvu");
          fetch(url, {
            method: "POST",
            header: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
          })
            .then((response) => {
                console.log(response);
              return response.text();
            })
            .catch((data) => {
              
              addPhoto(JSON.parse(data));
              console.log(data);
            });
        }
    };

    return (
        <div>
            <input type='file' ref={inputFile}></input>
            <button onClick={() => onSubmit()}>Upload</button>
        </div>
    )
};

export default Upload;