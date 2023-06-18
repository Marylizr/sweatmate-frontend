import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";

const override = css`
   display: flex;
   justify-content: center;
   align-items: center;
   align-content: center;
   color: teal;
   flex-wrap: wrap;
   margin-top:250px;
`;

const LoadingPage = () => {

   return(

      <div className="sweet-loading">

         <DotLoader loading={true} css={override} size={50}/>

      </div>
   )

}

export default LoadingPage;