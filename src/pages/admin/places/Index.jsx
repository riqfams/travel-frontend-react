import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PaginationComponent from "../../../components/util/Pagination";

function PlacesIndex() {

    document.title = "Places - Administrator Travel GIS";

    const [places, setPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const token = Cookies.get("token");

    const fetchData = async (pageNumber, searchData) => {

        const searchQuery = searchData ? searchData : search;
        const page = pageNumber ? pageNumber : currentPage;

        const response = await Api.get(`/api/admin/places?q=${searchQuery}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.data.data;

        setPlaces(data.data);
        setCurrentPage(data.current_page);
        setPerPage(data.per_page);
        setTotal(data.total);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const searchHandler = (e) => {
        e.preventDefault();

        fetchData(1, search);
    };

    const deletePlace = (id) => {
        confirmAlert({
            title: "Are you sure?",
            message: "Delete this data?",
            buttons: [{
                label: 'YES',
                onClick: async () => {
                    await Api.delete(`/api/admin/place/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(() => {
                        toast.success('Delete successfuly', {
                            duration: 4000,
                            position: "top-right",
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        });
                        fetchData();
                    })
                }
            },
            {
                label: 'No',
                onClick: () => {}
            }]
        })
    }
    
    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-map-marked-alt"></i> PLACES</span>
                            </div>
                            <div className="card-body">

                                <form onSubmit={searchHandler} className="form-group">
                                    <div className="input-group mb-3">
                                        <Link to="/admin/places/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> ADD NEW</Link>
                                        <input type="text" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by place title" />
                                        <button type="submit" className="btn btn-md btn-success"><i className="fa fa-search"></i> SEARCH</button>
                                    </div>
                                </form>
                            
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {places.map((place, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{place?.title}</td>
                                                <td>{place?.category.name}</td>
                                                <td className="text-center">
                                                    <Link to={`/admin/places/edit/${place.id}`} className="btn btn-sm btn-primary me-2"><i className="fa fa-pencil-alt"></i></Link>
                                                    <button onClick={() => deletePlace(place.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <PaginationComponent 
                                    currentPage={currentPage} 
                                    perPage={perPage} 
                                    total={total} 
                                    onChange={(pageNumber) => fetchData(pageNumber)}
                                    position="end"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </React.Fragment>
    );
}

export default PlacesIndex;

// //import react
// import React, { useState, useEffect } from "react";

// //import layout
// import LayoutAdmin from "../../../layouts/Admin";

// //import BASE URL API
// import Api from "../../../api";

// //import js cookie
// import Cookies from "js-cookie";

// //import Link from react router dom
// import { Link } from "react-router-dom";

// //import pagination component
// import PaginationComponent from "../../../components/util/Pagination";

// function PlacesIndex() {

//     //title page
//     document.title = "Places - Administrator Travel GIS";

//     //state places
//     const [places, setPlaces] = useState([]);

//     //state currentPage
//     const [currentPage, setCurrentPage] = useState(1);

//     //state perPage
//     const [perPage, setPerPage] = useState(0);

//     //state total
//     const [total, setTotal] = useState(0);

//     //state search
//     const [search, setSearch] = useState("");

//     //token
//     const token = Cookies.get("token");

//     //function "fetchData"
//     const fetchData = async (pageNumber, searchData) => {

//         //define variable "page"
//         const page = pageNumber ? pageNumber : currentPage;

//         //define variable "searchQuery"
//         const searchQuery = searchData ? searchData : search;

//         //fetching data from Rest API
//         await Api.get(`/api/admin/places?q=${searchQuery}&page=${page}`, {
//             headers: {
//                 //header Bearer + Token
//                 Authorization: `Bearer ${token}`,
//             }
//         }).then(response => {
//             //set data response to state "places"
//             setPlaces(response.data.data.data);

//             //set currentPage
//             setCurrentPage(response.data.data.current_page);

//             //set perPage
//             setPerPage(response.data.data.per_page);

//             //total
//             setTotal(response.data.data.total);
//         });
//     };

//     //hook
//     useEffect(() => {
//         //call function "fetchData"
//         fetchData();

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     //function "searchHandler"
//     const searchHandlder = (e) => {
//         e.preventDefault();

//         //call function "fetchDataPost"
//         fetchData(1, search)
//     }

//     return (
//         <React.Fragment>
//             <LayoutAdmin>
//               <div className="row mt-4">
//                 <div className="col-12">
//                   <div className="card border-0 rounded shadow-sm border-top-success">
//                     <div className="card-header">
//                         <span className="font-weight-bold"><i className="fa fa-map-marked-alt"></i> PLACES</span>
//                     </div>
//                     <div className="card-body">

//                         <form onSubmit={searchHandlder} className="form-group">
//                             <div className="input-group mb-3">
//                                 <Link to="/admin/places/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> ADD NEW</Link>
//                                 <input type="text" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by place title" />
//                                 <button type="submit" className="btn btn-md btn-success"><i className="fa fa-search"></i> SEARCH</button>
//                             </div>
//                         </form>
                      
//                         <div className="table-responsive">
//                             <table className="table table-bordered table-striped table-hovered">
//                                 <thead>
//                                 <tr>
//                                     <th scope="col">No.</th>
//                                     <th scope="col">Title</th>
//                                     <th scope="col">Category</th>
//                                     <th scope="col">Actions</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {places.map((place, index) => (
//                                     <tr key={index}>
//                                         <td className="text-center">{++index + (currentPage-1) * perPage}</td>
//                                         <td>{place.title}</td>
//                                         <td>{place.category.name}</td>
//                                         <td className="text-center"></td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                         <PaginationComponent 
//                             currentPage={currentPage} 
//                             perPage={perPage} 
//                             total={total} 
//                             onChange={(pageNumber) => fetchData(pageNumber)}
//                             position="end"
//                         />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </LayoutAdmin>
//         </React.Fragment>
//     );
// }

// export default PlacesIndex;