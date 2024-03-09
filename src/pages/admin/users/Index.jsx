import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../api";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PaginationComponent from "../../../components/util/Pagination";

function UserIndex() {
    document.title = "Users - Administrator Travel GIS";

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");

    const token = Cookies.get("token");

    const fetchData = async (pageNumber, searchData) => {
        
        const searchQuery = searchData ? searchData : search;
        const page = pageNumber ? pageNumber : currentPage;

        const response = await Api.get(`/api/admin/users?q=${searchQuery}&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.data.data;

        setUsers(data.data);
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

    const deleteUser = (id) => {
        confirmAlert({
            title: "Are you sure?",
            message: "Delete this data?",
            buttons: [{
                label: 'YES',
                onClick: async () => {
                    await Api.delete(`/api/admin/users/${id}`, {
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
                                <span className="font-weight-bold"><i className="fa fa-users"></i> USERS</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={searchHandler} className="form-group">
                                    <div className="input-group mb-3">
                                        <Link to="/admin/users/create" className="btn btn-md btn-success"><i className="fa fa-plus-circle"></i> ADD NEW</Link>
                                        <input type="text" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by user name" />
                                        <button type="submit" className="btn btn-md btn-success"><i className="fa fa-search"></i> SEARCH</button>
                                    </div>
                                </form>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hovered">
                                        <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Full Name</th>
                                            <th scope="col">Email Address</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{++index + (currentPage-1) * perPage}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td className="text-center">
                                                    <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary me-2"><i className="fa fa-pencil-alt"></i></Link>
                                                    <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
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

export default UserIndex;