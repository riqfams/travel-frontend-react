import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import CardPlace from "../../../components/util/CardPlace";
import PaginationComponent from "../../../components/util/Pagination";

function WebSearch() {

    document.title = "Search - TRAVEL GIS - Website Wisata Berbasis GIS (Geographic Information System)";

    const [places, setPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);
    
    const query = new URLSearchParams(useLocation().search);

    const fetchDataPlace = async (pageNumber) => {

        const page = pageNumber ? pageNumber : currentPage;

        await Api.get(`/api/web/places?q=${query.get("q")}&page=${page}`)
        .then((response) => {
            setPlaces(response.data.data.data);
            setCurrentPage(response.data.data.current_page);
            setPerPage(response.data.data.per_page);
            setTotal(response.data.data.total);
        })
    }

    useEffect(() => {
        fetchDataPlace();
    }, [query.get("q")]);

    return (
        <React.Fragment>
            <LayoutWeb>
                <div className="container mt-80">
                    <div className="row">
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
                    <PaginationComponent 
                        currentPage={currentPage} 
                        perPage={perPage} 
                        total={total} 
                        onChange={(pageNumber) => fetchDataPlace(pageNumber)}
                        position="center"
                    />
                </div>
            </LayoutWeb>
        </React.Fragment>
    )

}

export default WebSearch;