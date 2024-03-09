import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Api from "../../../api";

function UserEdit() {
    document.title = "Edit User - Admin Travel GIS";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [validation, setValidation] = useState({});
    
    const token = Cookies.get("token");
    
    const { id } = useParams();
    const navigate = useNavigate();

    const getUserById = async () => {
        const response = await Api.get(`/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('response: ', response)

        const data = await response.data.data

        setName(data.name);
        setEmail(data.email);
    }

    useEffect(() => {
        getUserById();
    }, []);

    const updateUser = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        formData.append('_method', 'PATCH');

        await Api.post(`/api/admin/users/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(() => {
            toast.success("Data saved successfuly!", {
                duration: 4000,
                position: "bottom-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            navigate("/admin/users");
        })
        .catch((error) => {
            setValidation(error.response.data);
            console.log("error response", error.response);
        })
    }

    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-users"></i> EDIT USER</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={updateUser}>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Full Name</label>
                                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Full Name"/>
                                            </div>
                                            {validation.name && (
                                                <div className="alert alert-danger">
                                                    {validation.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Email Address</label>
                                                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Address"/>
                                            </div>
                                            {validation.email && (
                                                <div className="alert alert-danger">
                                                    {validation.email[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Password</label>
                                                <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"/>
                                            </div>
                                            {validation.password && (
                                                <div className="alert alert-danger">
                                                    {validation.password[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Password Confirmation</label>
                                                <input type="text" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Enter Password Confirmation"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-md btn-success me-2"><i className="fa fa-save"></i> UPDATE</button>
                                        <button type="reset" className="btn btn-md btn-warning"><i className="fa fa-redo"></i> RESET</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutAdmin>
        </React.Fragment>
    );
}

export default UserEdit;