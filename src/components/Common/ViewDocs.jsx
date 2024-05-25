import { LuPcCase } from 'react-icons/lu'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { useEffect, useState } from "react";
import Loader from "./loader";
import { API_BASE_IMG } from '../../apis/upload';
export default function ViewDocs({hide,details,type}){
    const [loading,setLoading] = useState({status:true,height:"0%",width:"0%"})
    const [pdfUrl, setPdfUrl] = useState('');


useEffect(()=>{
    if(details?.details?.docType!="image"){
        const fetchPdf = async () => {
            try {
              const response = await fetch(`${API_BASE_IMG}${encodeURIComponent(details?.details?.docURL)}`);
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              setPdfUrl(url);
            } catch (error) {
              console.error('Error fetching PDF:', error);
            }
          };
      
          fetchPdf();
    }
},[])

    // console.log("doc details",details?.details,details?.details?.docType=="image");
return(<>
<div className="100%" style={{height:'100vh'}}>
<div className="d-flex justify-content-between bg-color-1 text-primary fs-5 px-4 py-3 shadow">
                    <div className="d-flex flex   align-items-center gap-3">
                        <IoArrowBackCircleOutline className="fs-3" onClick={hide} style={{ cursor: "pointer" }} />
                        <div className="d-flex flex align-items-center gap-1">
                            <span>{type}</span>
                            <span><LuPcCase /></span>
                        </div>
                    </div>
                </div>
{/* {loading.status && <Loader/>} */}

    {details?.details?.docType=="image" ? <div className='d-flex align-items-center   justify-content-center h-100'>
<img src={`${API_BASE_IMG}/${encodeURIComponent(details?.details?.docURL)}`} className={`${loading.height} ${loading.width}`} alt='docImg' onLoad={()=>setLoading({status:false,height:"h-75",width:"w-75 border border-primary rounded-2"})}/>
</div> :

 <iframe
          id='id12321'
          title='casedoc'
          width={loading.width}
          height={loading.height}
          frameborder="0"
          name="cboxmain" 
          seamless="seamless" 
          onLoad={() => setLoading({status:false,height:"100%",width:"100%"})}
          src={`${API_BASE_IMG}/${encodeURIComponent(details?.details?.docURL)}`}
          // src={pdfUrl}
        ></iframe>
}

</div>
    </>
)
}

{/* <iframe
          id='id12321'
          title='casedoc'
          width={loading.width}
          height={loading.height}
          frameborder="0"
        //   scrolling="no" 
          name="cboxmain" 
          seamless="seamless" 
          onLoad={() => setLoading({status:false,height:"100%",width:"100%"})}
          src={`${API_BASE_IMG}/${details?.details?.docURL}`}
        ></iframe> */}