import React, { useState } from "react";
import studentApplications from "../apis/changeapplis";
import MessChangeCard from "../Components/MessChangeCard";
import Pagination from "../Components/Pagination";
const MessChangePage = () => {

    const [pageNumber, setPageNumber] = useState(1);
    const itemPerPage = 3;
    const lower = itemPerPage*(pageNumber-1);
    const upper = itemPerPage*pageNumber+1;
    const pages = Math.ceil(studentApplications.length/itemPerPage);

    const paginate = (number) => {
        setPageNumber(number);
    }
    return (
        <>
        {studentApplications.map((val, idx) => {
            let i = idx+1;
            return (
                (i>lower && i<upper)&&<MessChangeCard {...val}/>
            )
        })}
        <Pagination pages={pages} paginate={paginate} pageNumber={pageNumber}/>
        </>
    )
}

export default MessChangePage