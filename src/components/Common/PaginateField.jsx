import React from 'react'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import ReactPaginate from 'react-paginate'

export default function PaginateField({ pgNo = 0, pageCount = 0,handlePageClick }) {
    return (
        <div>
            <ReactPaginate
                breakLabel="..."
                nextLabel={<BiRightArrow />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                breakClassName={""}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                previousLabel={<BiLeftArrow />}
                className="d-flex flex gap-2"
                pageClassName="border border-primary paginate-li"
                previousClassName="paginate-li bg-color-3"
                nextClassName="paginate-li bg-color-3"
                activeClassName="bg-primary text-white"
                renderOnZeroPageCount={null}
                forcePage={pgNo > 0 ? pgNo - 1 : 0}
            />
        </div>
    )
}
