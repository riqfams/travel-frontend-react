import React, { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import Slider from "../../../components/web/Slider";
import Api from "../../../api";
import CardCategory from "../../../components/util/CardCategory";
import { useNavigate } from "react-router-dom";

function Home() {

    document.title = "TRAVEL GIS - Website Wisata Berbasis GIS (Geographic Information System)";

    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    const fetchDataCategories = async () => {
        await Api.get('/api/web/categories')
        .then((response) => {
            setCategories(response.data.data)
        })
    }

    useEffect(() => {
        fetchDataCategories();
    })

    const searchHandler = () => {
        navigate(`/search?q=${keyword}`);
    }

    return (
        <React.Fragment>
            <LayoutWeb>
                <Slider />

                <div className="container mb-5">
                    <div className="row mt-minus-87">
                        <div className="col-md-12">
                            <div className="card border-0 rounded shadow-sm">
                                <div className="card-body">
                                    <h5>
                                        <i className="fa fa-search"></i> FIND YOUR FAVORITE PLACE
                                    </h5>
                                    <p>
                                        Find your favorite place to vacation with your family!
                                    </p>
                                    <hr />
                                    <input type="text" className="form-control" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchHandler()} placeholder="find your destination here..." />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        {
                            categories.map((category) => (
                                <CardCategory 
                                key={category.id}
                                id={category.id} 
                                name={category.name} 
                                slug={category.slug} 
                                image={category.image} 
                                />
                            ))
                        }
                    </div>
                </div>

            </LayoutWeb>
        </React.Fragment>
    );
}

export default Home;