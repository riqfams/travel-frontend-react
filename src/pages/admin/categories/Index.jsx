import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import PaginationComponent from "../../../components/util/Pagination";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

function CategoriesIndex() {

    document.title = "Categories - Administrator Travel GIS";

    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const token = Cookies.get("token");

    const fetchData = async (pageNumber, searchData) => {
        // await Api.get('/api/admin/categories', {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     }
        // })
        // .then(response => {
        //     setCategories(response.data.data.data);
        //     setCurrentPage(response.data.data.current_page);
        //     setPerPage(response.data.data.per_page);
        //     setTotal(response.data.data.total);
        // });
        const searchQuery = searchData ? searchData : search;
        const page = pageNumber ? pageNumber : currentPage;

        const response = await Api.get(`/api/admin/categories?q=${searchQuery}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.data.data;

        setCategories(data);
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

    const deleteCategory = (id) => {
        confirmAlert({
            title: "Are you sure?",
            message: "Delete this data?",
            buttons: [{
                label: 'YES',
                onClick: async () => {
                    await Api.delete(`/api/admin/categories/${id}`, {
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

    return(
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-folder"></i> CATEGORIES</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={searchHandler} className="form-group">
                                    <div className="input-group mb-3">
                                        <Link to="/admin/categories/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> ADD NEW</Link>
                                        <input type="text" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by category name" />
                                        <button type="submit" className="btn btn-md btn-success"><i className="fa fa-search"></i> SEARCH</button>
                                    </div>
                                </form>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Image</th>
                                            <th scope="col">Category Name</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {categories.map((category, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1 }</td>
                                                <td className="text-center">
                                                    <img src={'http://127.0.0.1:8000'+category.image} alt="" width="100" />
                                                </td>
                                                <td>{category.name}</td>
                                                <td className="text-center">
                                                    <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-sm btn-primary me-2"><i className="fa fa-pencil-alt"></i></Link>
                                                    <button onClick={() => deleteCategory(category.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
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
    )

}

export default CategoriesIndex