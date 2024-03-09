import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../../api";
import toast from "react-hot-toast";

function CategoryEdit() {

    document.title = "Edit Category - Admin Travel GIS";
    
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [validation, setValidation] = useState({});
    
    const token = Cookies.get("token");
    
    const navigate = useNavigate();
    const { id } = useParams();

    const getCategoryById = async () => {
        const response = await Api.get(`/api/admin/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.data.data

        setName(data.name);
    }

    useEffect(() => {
        getCategoryById();
    }, []);

    const handleFileChange = (e) => {
        const imageData = e.target.files[0]
        if (!imageData.type.match('image.*')) {
            setImage('');
            toast.error("Format File not Supported!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return
        }
        setImage(imageData);
    }

    const updateCategory = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('_method', 'PATCH')

        await Api.post(`/api/admin/categories/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            }
        }).then(() => {
            toast.success("Data Updated Successfully!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            navigate("/admin/categories");
        })
        .catch((error) => {
            setValidation(error.response.data);
        })
    }

    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-folder"></i> EDIT CATEGORY</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={updateCategory}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Image</label>
                                        <input type="file" className="form-control" onChange={handleFileChange}/>
                                    </div>
                                    {validation.image && (
                                        <div className="alert alert-danger">
                                            {validation.image[0]}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category Name</label>
                                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Category Name"/>
                                    </div>
                                    {validation.name && (
                                        <div className="alert alert-danger">
                                            {validation.name[0]}
                                        </div>
                                    )}
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

export default CategoryEdit;