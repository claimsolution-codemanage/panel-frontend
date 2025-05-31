import HashLoader from "react-spinners/HashLoader";
import SyncLoader from "react-spinners/SyncLoader"

export default function Loader(){
    return(<div>
    <div className="d-flex align-items-center justify-content-center" style={{height:'50vh'}}></div>
    <div className="d-flex justify-content-center align-items-center">
    <SyncLoader color="#092bf7" />
    </div>
    </div>
    )
}