import { Link, useNavigate } from 'react-router-dom'
import { IoFolder } from 'react-icons/io5'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from 'react-bootstrap'
import { useState } from 'react'
export default function ClientOtherCaseSection({ data, viewOtherClientCasePath }) {
    const [showDocList, setShowDocList] = useState(false)

    return (
        <div>
            <div className="bg-color-1 my-5 p-3 p-md-5 rounded-2 shadow">
                <div className="border-3 border-primary border-bottom py-2 mb-5">
                    <div className="d-flex gap-3 justify-content-between text-primary text-center fs-4">
                        <div className='d-flex gap-1'>
                            <span className="text-capitalize">Client Other Cases </span>
                            <div>
                                <span className="" >{`(${data?.length})`}</span>
                            </div>
                        </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDocList(!showDocList)}>
                                {showDocList ? (
                                    <> <EyeOff className="w-4 h-4 mr-1" /> Hide </>
                                ) : (
                                    <><Eye className="w-4 h-4 mr-1" /> View </>
                                )}
                            </Button>
                    </div>
                </div>
                {showDocList && <div className="row row-cols-1 row-cols-md-4 align-items-center">

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
                </div>}
            </div>
        </div>
    )
}
