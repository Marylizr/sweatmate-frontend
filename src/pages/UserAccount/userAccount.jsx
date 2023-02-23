import styles from "./settings.module.css"
import { useEffect , useState, useRef} from "react";
import userimg from './images/userimg.svg'
import pen from './images/pen.svg'
import customFetch from '../../api';

// import { AdvancedImage } from '@cloudinary/react';
// import { Cloudinary } from '@cloudinary/url-gen';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

const AccountSetting = () => {

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => { 
      setPasswordShown(passwordShown ? false : true); 
    };

    const [user, setUser] = useState({name:"name", surname:"surname", email: "email", password:"pass",image:"image", currency:"currency", wallet:"wallet"});
    const [initialCurrency, setInitialCurrency] = useState({currency:"currency"});

    const getUser = () => {
      customFetch("GET", "users/me")
      .then((json) => { setUser({...json, password:""});   
        setInitialCurrency(json.currency)  }); }
    
    useEffect(() => {
     getUser() 
   },[]);

    const onSubmit = async() => {
      const wallet = (initialCurrency==="€" && user.currency==="$") ? (Math.floor(1.1*user.wallet)).toFixed(4) : ((initialCurrency==="$" && user.currency==="€") ? (Math.floor(0.9*user.wallet)).toFixed(4) : user.wallet);
      let resultado;
      const imagen = fileUpload();
      await imagen.then(result => { resultado = result; })
      const data = {
        name: user.name, 
        surname: user.surname, 
        email:user.email, 
        password:user.password,
        image:resultado ? resultado : user.image, 
        currency:user.currency, 
        wallet:wallet
      }
      
      customFetch("PUT", "users/", {body:data})
      .then(response => {console.log(response);})
      .then(res => {window.location.reload();})
      .catch(err => console.log(err));      
    }

    const fileUpload = async () => {
        const files = inputFile.current.files;
        const formData = new FormData();
        const url = "https://api.cloudinary.com/v1_1/dlh7p829u/image/upload";
        let imagen;
      
        let file = files[0];
        formData.append("file", file);
        formData.append("upload_preset", "vn6yolxr");
        await fetch(url, {
          method: "POST",
          header: {
              'Content-Type': 'multipart/form-data'
          },
          body: formData
        })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((photo) => {
          imagen = photo.url;
        })
        .catch((data) => {
          console.log(data);
        });

        return imagen;
    }

    const inputFile = useRef(null);

    return(

      <div className = {styles.settings}>
          <div className = {styles.editbox}>
              <form className= {styles.form} >
                  <p>Edit profile</p>
                  
                  <div className={styles.images}>
                    <div className={styles.userimage}><img src={user.image ? user.image : userimg } 
                    className = {styles.imagen} alt="userImage"/></div>
                    <div className={styles.editimg}>
                      
                      <label>
                        <input type='file' ref={inputFile} 
                        onChange={(e) => setUser({...user,image: URL.createObjectURL(e.target.files[0])}) }
                        className={styles.uploading}></input>
                        <img src={pen} alt="penlogo"/>
                      </label>
                    </div>
                  </div>

                  <div className= {styles.namesinput}>
                    <input className = {styles.names} type='text' value={user.name} 
                    onChange={(e) =>setUser({...user,name: e.target.value })} placeholder="name"></input>
                    <input className = {styles.names} type='text' value={user.surname}  
                    onChange={(e) =>setUser({...user,surname: e.target.value})} placeholder="surname"></input>
                  </div>
                  <div className= {styles.nameserror}>
                    {!user.name && <span><h3>X</h3></span>}
                    {!user.surname && <span><h3>X</h3></span>}
                  </div>

                  <input className = {styles.email} type="email" value={user.email} 
                  onChange={(e) =>setUser({...user,surname: e.target.value})} placeholder="email"></input>
                  {!user.email && <span><h3>X</h3></span>}
                  
                  <div className={styles.passwordeye}>
                    <input className = {styles.password} type={passwordShown ? "text" : "password"} 
                    onChange={(e) =>setUser({...user,password: e.target.value})} placeholder="Password"  />
                    <i className={styles.eye} onClick={togglePasswordVisiblity}>{eye}</i>
                  </div>


                  <select  type='currency' value={user.currency} onChange={(e) =>setUser({...user,currency: e.target.value})} >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    </select>

                  <button className = {styles.submit} 
                  onClick={(e) => {e.preventDefault();e.stopPropagation();onSubmit();}}>Save</button>
              </form>
          </div>
      </div>

    )
}

export default AccountSetting;