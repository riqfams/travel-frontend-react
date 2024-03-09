import React, { useEffect, useState, useRef } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Api from "../../../api";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function PlaceCreate() {

    document.title = "Add New Place - Admin Travel GIS";

    const [title, setTitle] = useState("");
    const [categoryID, setCategoryID] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [officeHours, setOfficeHours] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);

    const [validation, setValidation] = useState({});
    
    const token = Cookies.get("token");
    
    const navigate = useNavigate();

    const fetchCategories = async () => {
        await Api.get('/api/web/categories')
        .then(response => {
            setCategories(response.data.data);
            console.log("setCategories", response.data.data);
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFileChange = (e) => {
        const imageData = e.target.files;
        Array.from(imageData).forEach(image => {
            if (!image.type.match('image.*')) {
                setImages([]);
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
            } else {
                setImages([...e.target.files]);
            }
        });
    }

    const storePlace = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category_id', categoryID);
        formData.append('description', description);
        formData.append('phone', phone);
        formData.append('website', website);
        formData.append('office_hours', officeHours);
        formData.append('address', address);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        Array.from(images).forEach(image => {
            formData.append('image[]', image);
        })

        await Api.post('/api/admin/places', formData, {
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
            navigate("/admin/places");
        })
        .catch((error) => {
            setValidation(error.response.data);
            console.log("error response", error.response);
        })
    }

    //MAPBOX
    const mapContainer = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: 12
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: {
                isDraggable: true
            },
            mapboxgl: mapboxgl
        });

        map.addControl(geocoder);

        const marker = new mapboxgl.Marker({
            draggable: true,
            color: "rgb(47 128 237)" 
        })
        .setLngLat([longitude, latitude])
        .addTo(map);

        geocoder.on('result', function(e) {
            marker.remove();
            marker.setLngLat(e.result.center).addTo(map);
            marker.on('dragend', function(e) {
                setLongitude(e.target._lngLat.lng)
                setLatitude(e.target._lngLat.lat)
            });
        });
    }, [])

    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4 mb-5">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">
                            <div className="card-header">
                                <span className="font-weight-bold"><i className="fa fa-map-marked-alt"></i> ADD NEW PLACE</span>
                            </div>
                            <div className="card-body">
                                <form onSubmit={storePlace}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Image (<i>select many file</i>)</label>
                                        <input type="file" className="form-control" onChange={handleFileChange} multiple/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Title</label>
                                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title Place"/>
                                    </div>
                                    {validation.title && (
                                        <div className="alert alert-danger">
                                            {validation.title[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Category</label>
                                            <select className="form-select" value={categoryID} onChange={(e) => setCategoryID(e.target.value)}>
                                                <option value="">-- Select Category --</option>
                                                {
                                                categories.map((category) => (
                                                    <option value={category.id} key={category.id}>{category.name}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        {validation.category_id && (
                                            <div className="alert alert-danger">
                                                {validation.category_id[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Office Hours</label>
                                            <input type="text" className="form-control" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} placeholder="Enter Office Hours"/>
                                        </div>
                                        {validation.officeHours && (
                                            <div className="alert alert-danger">
                                                {validation.officeHours[0]}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <ReactQuill theme="snow" rows="5" value={description} onChange={(content) => setDescription(content)}/>
                                    </div>
                                    {validation.description && (
                                        <div className="alert alert-danger">
                                            {validation.description[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Phone</label>
                                            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone"/>
                                        </div>
                                        {validation.phone && (
                                            <div className="alert alert-danger">
                                                {validation.phone[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Website</label>
                                            <input type="text" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Enter Website Place"/>
                                        </div>
                                        {validation.website && (
                                            <div className="alert alert-danger">
                                                {validation.title[0]}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Address</label>
                                        <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address Place"></textarea>
                                    </div>
                                    {validation.address && (
                                        <div className="alert alert-danger">
                                            {validation.address[0]}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Latitude</label>
                                            <input type="text" className="form-control" readOnly value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude Place"/>
                                        </div>
                                        {validation.latitude && (
                                            <div className="alert alert-danger">
                                                {validation.latitude[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Longitude</label>
                                            <input type="text" className="form-control" readOnly value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude Place"/>
                                        </div>
                                        {validation.longitude && (
                                            <div className="alert alert-danger">
                                                {validation.longitude[0]}
                                            </div>
                                        )}
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <div ref={mapContainer} className="map-container" />
                                            </div>
                                        </div>
                                    </div>
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

export default PlaceCreate;