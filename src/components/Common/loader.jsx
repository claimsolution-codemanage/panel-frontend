import HashLoader from "react-spinners/HashLoader";

export default function Loader(){
    return(<div>
    <div className="d-flex align-items-center justify-content-center" style={{height:'50vh'}}></div>
    <div className="d-flex justify-content-center align-items-center">
    <HashLoader color="#092bf7" />
    </div>
    </div>
    )
}