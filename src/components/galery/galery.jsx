import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
// import {Transformation} from "@cloudinary/url-gen";
import { fill } from '@cloudinary/url-gen/actions/resize';
import React from 'react';

const Galery = ({ photos }) => {
    const cld = new Cloudinary({
        cloud: {
          cloudName: 'da6il8qmv'
        }
      }); 
      console.log(photos)
    
    return (
        <div>
            {photos.map(photo => (
                <div>
                   
                    <AdvancedImage 
                        cldImg={cld.image(photo.public_id).resize(fill().width(800))} 
                        
                    />
                </div>
            ))}
        </div>
    );
};

export default Galery;