import { Routes, Route } from "react-router-dom";

import Login from '../pages/admin/Login.jsx';
import PrivateRoutes from "./PrivateRoute.jsx";
import Dashboard from "../pages/admin/dashboard/Index.jsx";
import CategoriesIndex from "../pages/admin/categories/Index.jsx";
import CategoryCreate from "../pages/admin/categories/Create.jsx";
import CategoryEdit from "../pages/admin/categories/Edit.jsx";
import PlacesIndex from "../pages/admin/places/Index.jsx";
import PlaceCreate from "../pages/admin/places/Create.jsx";
import PlaceEdit from "../pages/admin/places/Edit.jsx";
import SliderIndex from "../pages/admin/sliders/Index.jsx";
import SliderCreate from "../pages/admin/sliders/Create.jsx";
import UserIndex from "../pages/admin/users/Index.jsx";
import UserCreate from "../pages/admin/users/Create.jsx";
import UserEdit from "../pages/admin/users/Edit.jsx";
import Home from "../pages/web/home/index.jsx";
import WebCategoryShow from "../pages/web/categories/Show.jsx";
import WebPlacesIndex from "../pages/web/places/Index.jsx";
import WebPlacesShow from "../pages/web/places/Show.jsx";
import WebPlaceDirection from "../pages/web/places/Direction.jsx";
import WebMapsIndex from "../pages/web/maps/Index.jsx";
import WebSearch from "../pages/web/search/Index.jsx";

function RoutesIndex() {
    return (
        <Routes>

            <Route path="/admin/login" element={
                <Login />
            } />

            <Route path="/admin/dashboard" element = {
                <PrivateRoutes>
                    <Dashboard/>
                </PrivateRoutes>
            } />

            <Route path="/admin/categories" element = {
                <PrivateRoutes>
                    <CategoriesIndex/>
                </PrivateRoutes>
            } />

            <Route path="/admin/categories/create" element = {
                <PrivateRoutes>
                    <CategoryCreate/>
                </PrivateRoutes>
            } />

            <Route path="/admin/categories/edit/:id" element = {
                <PrivateRoutes>
                    <CategoryEdit/>
                </PrivateRoutes>
            } />

            <Route path="/admin/places" element = {
                <PrivateRoutes>
                    <PlacesIndex/>
                </PrivateRoutes>
            } />

            <Route path="/admin/places/create" element = {
                <PrivateRoutes>
                    <PlaceCreate/>
                </PrivateRoutes>
            } />

            <Route path="/admin/places/edit/:id" element = {
                <PrivateRoutes>
                    <PlaceEdit/>
                </PrivateRoutes>
            } />

            <Route path="/admin/sliders" element = {
                <PrivateRoutes>
                    <SliderIndex/>
                </PrivateRoutes>
            } />

            <Route path="/admin/sliders/create" element = {
                <PrivateRoutes>
                    <SliderCreate/>
                </PrivateRoutes>
            } />

            <Route path="/admin/users" element = {
                <PrivateRoutes>
                    <UserIndex/>
                </PrivateRoutes>
            } />

            <Route path="/admin/users/create" element = {
                <PrivateRoutes>
                    <UserCreate/>
                </PrivateRoutes>
            } />

            <Route path="/admin/users/edit/:id" element = {
                <PrivateRoutes>
                    <UserEdit/>
                </PrivateRoutes>
            } />

            <Route path="/" element={<Home />} />

            <Route path="/category/:slug" element = {
                <WebCategoryShow />
            } />

            <Route path="/places" element = {
                <WebPlacesIndex />
            } />

            <Route path="/places/:slug" element = {
                <WebPlacesShow />
            } />

            <Route path="/places/:slug/direction" element = {
                <WebPlaceDirection />
            } />

            <Route path="/maps" element = {
                <WebMapsIndex />
            } />

            <Route path="/search" element = {
                <WebSearch />
            } />

        </Routes>
    )
}

export default RoutesIndex