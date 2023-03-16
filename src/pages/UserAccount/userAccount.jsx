import styles from "./settings.module.css";
import { useEffect , useState, useRef} from "react";
import userimg from './images/userimg.svg'
import pen from './images/pen.svg'
import customFetch from '../../api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/navBar/navBar";
import { Link } from 'react-router-dom';
const eye = <FontAwesomeIcon icon={faEye} />;




const AccountSetting = () => {

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => { 
      setPasswordShown(passwordShown ? false : true); 
    };

    const [user, setUser] = useState(
      { 
         name:"name", 
         email: "email", 
         password:"pass", 
         image:"image", 
         age:"age", 
         height:"height",
         weight:"weight",
         goal:"goal"
      });
   

    const getUser = () => {
      customFetch("GET", "user/me")
      .then((json) => { 
         setUser({...json, password:""});  
         }); }
    
      useEffect(() => {
      getUser() 
    },[]);


    const onSubmit = async() => {
      
      const imagen = fileUpload();
      let resultado;
      await imagen.then(result => { resultado = result; }) 
      const data = {
        name: user.name, 
        email:user.email, 
        password:user.password,
        image:resultado ? resultado : user.image, 
        age:user.age,
        height: user.height,
        weight:user.weight,
        goal:user.goal
      }

      
      customFetch("PUT", "user", {body:data})
      .catch(err => console.log(err));      
    }

    const fileUpload = async () => {
        const files = inputFile.current.files;
        const formData = new FormData();
        const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;
        let imagen;
      
        let file = files[0];
        formData.append("file", file);
        formData.append("upload_preset", 'h9rhkl6h');
        console.log(formData, files)
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
    <div className={styles.container}>
      <NavBar />
      <div className = {styles.settings}>
        
          <div className = {styles.editbox}>
              <form className= {styles.form} >
                  <p>Edit profile </p>
                  
                  <div className={styles.images}>
                    <div className={styles.userimage}><img src={user.image ? user.image : userimg } 
                    className = {styles.imagen} alt="userImage"/></div>
                    <div className={styles.editimg}>
                      
                      <label>
                        <input type='file' ref={inputFile} 
                        onChange={(e) => setUser({...user, image: URL.createObjectURL(e.target.files[0])}) }
                        className={styles.uploading}></input>
                        <img src={pen} alt="penlogo"/>
                      </label>
                    </div>
                  </div>

                  <div className= {styles.namesinput}>
                    <input className = {styles.names} type='text' value={user.name} 
                    onChange={(e) =>setUser({...user,name: e.target.value })} placeholder="name" />

                  <input className= {styles.email} type="email" value={user.email} 
                  onChange={(e) =>setUser({...user,email: e.target.value})} placeholder="email" />
                  {!user.email && <span><h3>X</h3></span>}

                  <input className= {styles.names} type="number" value={user.age}  
                    onChange={(e) =>setUser({...user, age: e.target.value})} placeholder="age" />

                  <input className= {styles.names} type="number" value={user.height}  
                    onChange={(e) =>setUser({...user, height: e.target.value})} placeholder="height" />

                  <input className= {styles.names} type="number" value={user.weight}  
                    onChange={(e) =>setUser({...user, weight: e.target.value})} placeholder="weight" />

                  <select className= {styles.names} type="text" value={user.goal} onChange={(e) =>setUser({...user, goal: e.target.value})} >
                    <option value="Fat-Lost">Fat Lost</option>
                    <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
                    <option value="Manteninance">Manteninance</option>
                  </select>    

                  </div>

                  <div className= {styles.nameserror}>
                    {!user.name && <span><h3>X</h3></span>}
                  </div>
                  
                  <div className={styles.passwordeye}>
                    <input className = {styles.password} type={passwordShown ? "text" : "password"} 
                    onChange={(e) =>setUser({...user,password: e.target.value})} placeholder="Password"  />
                    <i className={styles.eye} onClick={togglePasswordVisiblity}>{eye}</i>
                  </div>

                  <button className = {styles.submit} 
                  onClick={(e) => {e.preventDefault();e.stopPropagation();onSubmit();}}>Save</button>
              </form>
          </div>
          <div className={styles.infoCard}>
            <img src={user.image}  alt=''/>
            <p>name: {user.name}</p>
            <p>age: {user.age} years old</p>
            <p>weight: {user.weight} kg</p>
            <p>height: {user.height} cm</p>
            <p>goal: {user.goal}</p>
            <button className={styles.save}><Link to="/savedworkouts"> my WorkOuts </Link> </button>
          </div>
      </div>
    </div>
    )
}

export default AccountSetting;

