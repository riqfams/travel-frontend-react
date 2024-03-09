import Cookies from "js-cookie";
import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import Api from "../api";
import Sidebar from "../components/admin/Sidebar";
import toast from "react-hot-toast";

const LayoutAdmin = ({children}) => {
    
    const [user, setUser] = useState({});
    const [sidebarToggle, setSidebarToggle] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const sidebarToggleHandler = (e) => {
        e.preventDefault();

        if(!sidebarToggle) {
            document.body.classList.add('sb-sidenav-toggled');
            setSidebarToggle(true);

        } else {
            document.body.classList.remove('sb-sidenav-toggled');
            setSidebarToggle(false);

        }
    }

    const fetchData = async () => {

        await Api.get('/api/admin/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setUser(response.data)
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const logoutHandler = async (e) => {
        
        e.preventDefault();
        
        await Api.post('/api/admin/logout', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            Cookies.remove('token');

            toast.success("Logout Successfully.", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            navigate('/admin/login');
        })
    };

    return(
        <React.Fragment>
            <div className="d-flex sb-sidenav-toggled" id="wrapper">
            <div className="bg-white" id="sidebar-wrapper">
                <Link to="/" className="text-decoration-none">
                    <div className="sidebar-heading bg-light text-center"><i className="fa fa-map-marked-alt"></i> <strong>TRAVEL GIS</strong> <small>ADMIN</small></div>
                </Link>
                <Sidebar />
            </div>
            <div id="page-content-wrapper">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button className="btn btn-success-dark" onClick={sidebarToggleHandler}><i className="fa fa-list-ul"></i></button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                            <NavDropdown title={user.name} className="fw-bold" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/" target="_blank"><i className="fa fa-external-link-alt me-2"></i> Visit Web</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/admin/categories"><i className="fa fa-folder me-2"></i> Categories</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/places"><i className="fa fa-map-marked-alt me-2"></i> Places</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/sliders"><i className="fa fa-images me-2"></i> Sliders</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/users"><i className="fa fa-users me-2"></i> Users</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logoutHandler}><i className="fa fa-sign-out-alt me-2"></i> Logout</NavDropdown.Item>
                            </NavDropdown>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid">
                    {children}
                </div>
            </div>
        </div>
        </React.Fragment>
    )
}

export default LayoutAdmin;