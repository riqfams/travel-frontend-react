import React, { useEffect, useState, useRef } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../api";
import mapboxgl from 'mapbox-gl'; 

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebMapsIndex() {

    document.title = "Maps - TRAVEL GIS - Website Wisata Berbasis GIS (Geographic Information System)";

    const mapContainer = useRef(null);
    const [coordinates, setCoordinates] = useState([]);

    const fetchDataPlaces = async () => {

        await Api.get('/api/web/all_places')
            .then((response) => {
                setCoordinates(response.data.data)
            })
    }

    useEffect(() => {
        fetchDataPlaces();
    }, []);

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [116.5519982204172, -2.8989093904502283],
            zoom: 4
        });

        coordinates.forEach((location) => {

            const popup = new mapboxgl.Popup()
                .setHTML(`<h6>${location.title}</h6><hr/><p><i class="fa fa-map-marker"></i> <i>${location.address}</i></p><hr/><div class="d-grid gap-2"><a href="/places/${location.slug}" class="btn btn-sm btn-success btn-block text-white">Lihat Selengkapnya</a></div>`)
                .addTo(map);

            new mapboxgl.Marker()
                .setLngLat([location.longitude, location.latitude])
                .setPopup(popup)
                .addTo(map);
        });

    })

    return (
        <React.Fragment>
            <LayoutWeb>
                <div className="container mt-80">
                    <div className="row">
                        <div className="col-md-12 mb-5">
                            <div className="card border-0 rounded shadow-sm">
                                <div className="card-body"><h5><i className="fa fa-map-marked-alt"></i> SEMUA DATA VERSI MAPS</h5>
                                    <hr />
                                    <div ref={mapContainer} className="map-container" style={{ height: "450px" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutWeb>
        </React.Fragment>
    )
}

export default WebMapsIndex;