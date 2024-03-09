import React, { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import { useParams } from "react-router-dom";
import Api from "../../../api";
import CardPlace from "../../../components/util/CardPlace";

function WebCategoryShow() {

    const [category, setCategory] = useState({});
    const [places, setPlaces] = useState([]);
    
    const { slug } = useParams();

    const fetchDataCategories = async () => {
        await Api.get(`/api/web/categories/${slug}`)
        .then((response) => {
            setCategory(response.data.data);
            setPlaces(response.data.data.places);
            document.title = `Category : ${response.data.data.name} - Website Wisata Berbasis GIS (Geographic Information System)`;
        })
    }

    useEffect(() => {
        fetchDataCategories();
    }, [slug]);

    return (
        <React.Fragment>
            <LayoutWeb>
                <div className="container mt-80">
                    <div className="row">
                        <div className="col-md-12">
                            <h4>CATEGORY : <strong className="text-uppercase">{category.name}</strong></h4>
                            <hr />
                        </div>
                        {
                            places.length > 0
                                ? places.map((place) => (
                                    <CardPlace
                                        key={place.id}
                                        id={place.id}
                                        slug={place.slug}
                                        title={place.title}
                                        images={place.images}
                                        address={place.address}
                                    />
                                ))
                                : <div className="alert alert-danger border-0 rounded shadow-sm" role="alert">
                                    <strong>Opps...!</strong> Data Belum Tersedia!.
                                </div>
                        }
                    </div>
                </div>
            </LayoutWeb>
        </React.Fragment>
    )

}

export default WebCategoryShow;