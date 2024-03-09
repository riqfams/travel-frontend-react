import React, { useEffect, useState } from "react";
import Api from "../../api";
import { Carousel } from "react-bootstrap";

function Slider() {
    const [sliders, setSliders] = useState([]);
    
    const fetchDataSliders = async () => {
        await Api.get('/api/web/sliders')
        .then((response) => {
            setSliders(response.data.data);
        })
    }

    useEffect(() => {
        fetchDataSliders();
    })

    return (
        <Carousel prevIcon={<i className="fa fa-chevron-left fa-lg carousel-custom text-dark shadow"></i>} nextIcon={<i className="fa fa-chevron-right fa-lg carousel-custom text-dark shadow"></i>}>
            {sliders.map((slider) => (
                <Carousel.Item key={slider.id}>
                    <img className="d-block w-100" src={'http://127.0.0.1:8000' + slider.image} style={{ height: "500px", objectFit: "cover" }}  alt="First slide"/>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default Slider;