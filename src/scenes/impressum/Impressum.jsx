import React, { Component } from 'react';

import '../less/landingPage.less';

import Navbar from '../shared/Navbar';
import Footer from '../components/Footer';
import Slider from '../components/primitive/Slider';
import SliderItem from '../components/primitive/SliderItem';
import SliderControl from '../components/primitive/SliderControl';
import SliderControlItem from '../components/primitive/SliderControlItem';
import carouselSlide01 from '../images/landingPage/carousel-slide-01.png';
import carouselSlide02 from '../images/landingPage/carousel-slide-02.png';
import carouselSlide03 from '../images/landingPage/carousel-slide-03.png';
import carouselSlide04 from '../images/landingPage/carousel-slide-04.png';

export default class Impressum extends Component {

    render() {
        return (
            <div className="application-wrapper landingPage-wrapper">
                <Navbar />
                <header className="header">
                    <div className="app-width">
                        <Slider control={<SliderControl><SliderControlItem /><SliderControlItem /><SliderControlItem /><SliderControlItem /></SliderControl>}>

                            <SliderItem>
                                <div className="caption">
                                    <h2>Web MAR Apps</h2>
                                    <p>Web-based applications for planning, management and optimization of managed aquifer recharge (MAR) schemes</p>
                                </div>
                                <div className="image-wrapper">
                                    <img src={carouselSlide01} alt="Web MAR Apps" width="558" height="326"/>
                                </div>
                            </SliderItem>

                            <SliderItem>
                                <div className="caption">
                                    <h2>Web MAR Tools</h2>
                                    <p>Free web-based modeling tools for simulation of processes ocurring during managed aquifer recharge</p>
                                </div>
                                <div className="image-wrapper">
                                    <img src={carouselSlide02} alt="Web MAR Tools" width="558" height="326" className="second-slide"/>
                                </div>
                            </SliderItem>

                            <SliderItem>
                                <div className="caption">
                                    <h2>Web MAR Data</h2>
                                    <p>Free web-based geospatial information system to upload, manage and share MAR-related geospatial and time series data</p>
                                </div>
                                <div className="image-wrapper">
                                    <img src={carouselSlide03} alt="Web MAR Data" width="558" height="326" className="third-slide"/>
                                </div>
                            </SliderItem>

                            <SliderItem>
                                <div className="caption">
                                    <h2>Web MAR Wiki</h2>
                                    <p>Detailed documentation of all applications, tools and database components, including practical examples and references for further read.</p>
                                </div>
                                <div className="image-wrapper">
                                    <img src={carouselSlide04} alt="Web MAR Wiki" width="558" height="326" className="fourth-slide"/>
                                </div>
                            </SliderItem>

                        </Slider>
                    </div>
                </header>

                <div className="app-width container">

                    <div className="row top-space">
                        <h2>Impressum</h2>
                        <p className="description">
                            Es gilt das <a href="https://tu-dresden.de/impressum" target="_blank">Impressum der TU Dresden</a> mit folgenden Abweichungen:
                        </p>

                        <p className="description">
                            <b>Inhaltlich verantwortlich:</b><br />
                            Dr. Catalin Stefan<br />
                            Technische Universität Dresden<br />
                            Junior Research Group INOWAS<br />
                            01062 Dresden<br />
                            Tel.: +49 3501 530044<br />
                            Fax: +49 3501 530022<br />
                            Email: catalin.stefan@tu-dresden.de<br />
                        </p>

                        <p className="description">
                            <b>Technischer Betrieb:</b><br />
                            Dipl.-Ing. Ralf Junghanns<br />
                            Technische Universität Dresden<br />
                            Junior Research Group INOWAS<br />
                            01062 Dresden<br />
                            Tel.: +49 3501 530039<br />
                            Fax: +49 3501 530022<br />
                            Email: ralf.junghanns@tu-dresden.de<br />
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}
