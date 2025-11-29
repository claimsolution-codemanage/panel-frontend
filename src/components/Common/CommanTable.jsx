import React from 'react'
import PaginateField from './PaginateField'

export default function CommanTable({columns,rows,rowCount,pageItemLimit,pgNo,handlePageClick}) {
    return (
        <div>
            <div className="mt-4 overflow-auto">
                <table className="table table-responsive rounded-2 shadow table-borderless">
                    <thead>
                        <tr className="bg-primary text-white text-center">
                            {columns?.map(col=>{
                                return (
                                    <th scope="col" className="text-nowrap" >{col?.headerName}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows?.map((item, ind) => <tr key={item._id} className="border-2 border-bottom border-light text-center">
                            {columns?.map(col=>{
                                return (
                                    <td key={col?.field} className="text-nowrap">{col?.renderCell ? col?.renderCell(item)  : item[col?.field]}</td>
                                )
                            })}
                        </tr>)}
                    </tbody>
                </table>

            </div>
            <div className="d-flex flex align-items-center justify-content-center">
                <PaginateField pgNo={pgNo} pageCount={Math.ceil(rowCount / pageItemLimit) || 1} handlePageClick={handlePageClick} />
            </div>
        </div>
    )
}
