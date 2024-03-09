import React, { useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Api from "../../../api";

function SliderCreate() {
    document.title = "Add New Sliders - Admin Travel GIS";

    const [image, setImage] = useState("");
    const [validation, setValidation] = useState({});
    
    const token = Cookies.get("token");
    
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const imageData = e.target.files[0];
        if (!imageData.type.match('image.*')) {
            setImage('');
            toast.error("Format not supported!", {
                duration: 4000,
                position: "bottom-right",
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

    const storeSlider = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);

        await Api.post('/api/admin/sliders', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data'
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
            navigate("/admin/sliders");
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
                                <span className="font-weight-bold"><i className="fa fa-images"></i> ADD NEW SLIDER</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={storeSlider}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Image</label>
                                        <input type="file" className="form-control" onChange={handleFileChange}/>
                                    </div>
                                    {validation.image && (
                                        <div className="alert alert-danger">
                                            {validation.image[0]}
                                        </div>
                                    )}
                                    <div>
                                        <button type="submit" className="btn btn-md btn-success me-2"><i className="fa fa-save"></i> SAVE</button>
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

export default SliderCreate;