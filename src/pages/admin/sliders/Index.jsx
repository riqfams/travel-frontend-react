import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PaginationComponent from "../../../components/util/Pagination";
import Api from "../../../api";

function SliderIndex() {

    document.title = "Sliders - Administrator Travel GIS";

    const [sliders, setSliders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const token = Cookies.get("token");

    const fetchData = async (pageNumber, searchData) => {

        const searchQuery = searchData ? searchData : search;
        const page = pageNumber ? pageNumber : currentPage;

        const response = await Api.get(`/api/admin/sliders?q=${searchQuery}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.data.data;

        setSliders(data.data);
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

    const deleteSlider = (id) => {
        confirmAlert({
            title: "Are you sure?",
            message: "Delete this data?",
            buttons: [{
                label: 'YES',
                onClick: async () => {
                    await Api.delete(`/api/admin/sliders/${id}`, {
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
                    <div className="col-md-12">
                        <div className="card border-0 border-top-success rounded shadow-sm mb-5">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-images"></i> SLIDERS</span>
                            </div>
                            <div className="card-body">
                                <div className="input-group mb-3">
                                    <Link to="/admin/sliders/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> ADD NEW</Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {sliders.map((slider, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{++index + (currentPage-1) * perPage}</td>
                                                    <td className="text-center">
                                                        <img src={'http://127.0.0.1:8000'+slider.image} alt="" width="200" className="rounded" />
                                                    </td>
                                                    <td className="text-center">
                                                        <Link to={`/admin/sliders/edit/${slider.id}`} className="btn btn-sm btn-primary me-2"><i className="fa fa-pencil-alt"></i></Link>
                                                        <button onClick={() => deleteSlider(slider.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                                    </td> 
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                </div>
            </LayoutAdmin>
        </React.Fragment>
    );
}

export default SliderIndex;