import { Link, useNavigate } from 'react-router-dom'
import { IoFolder } from 'react-icons/io5'
export default function ClientOtherCaseSection({data, viewOtherClientCasePath }) {

    return (
        <div>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex gap-3 justify-content-center text-primary text-center fs-4">
                        <span className="text-capitalize">Client Other Cases </span>
                        <div>
                            <span className="" >{`(${data?.length})`}</span>
                        </div>
                    </div></div>
                <div className="row row-cols-1 row-cols-md-4 align-items-center">

                    {data?.map(ele => <div key={ele} className="p-2">
                        <Link to={`${viewOtherClientCasePath}${ele?._id}`} target='_blank' className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3 cursor-pointer">
                            <div className="d-flex flex-column justify-content-center align-items-center py-5">
                                <div className="d-flex justify-content-center align-items-center fs-4 text-white bg-primary" style={{ height: '3rem', width: '3rem', borderRadius: '3rem' }}>
                                    <IoFolder className="text-light" />
                                </div>
                            </div>
                            <div className=" bg-dark gap-5 w-100 p-2 text-primary">
                                <p className="text-center text-wrap fs-5 text-capitalize p-0 m-0">{ele?.name}</p>
                                <p className="text-center text-wrap fs-5 text-capitalize p-0 m-0">{ele?.fileNo}</p>
                            </div>
                        </Link>
                    </div>)}
                    {/* {fileInfo?.list?.map(item =>
                        <div key={item?._id} className="p-2">
                            <div className="align-items-center bg-color-7 d-flex flex-column justify-content-center rounded-3">
                                <div className="w-100 p-2">
                                    <div className="dropdown float-end cursor-pointer">
                                        <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                        <ul className="dropdown-menu">
                                            <li><div className="dropdown-item"><Link to={`${getCheckStorage(item?.url) ? getCheckStorage(item?.url) : "#!"}`} target="_blank">View</Link></div></li>
                                            <li><div className="dropdown-item" onClick={() => handleShareDocument("whatsapp", item)}>WhatsApp</div></li>
                                            <li><div className="dropdown-item" onClick={() => handleShareDocument("email", item)}>Email</div></li>
                                            {role?.toLowerCase() == "admin" && <li><div onClick={() => setChangeIsActiveStatus({ show: true, details: { _id: item?._id, currentStatus: item?.isActive, name: item?.name } })} className="dropdown-item">Delete</div></li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}
