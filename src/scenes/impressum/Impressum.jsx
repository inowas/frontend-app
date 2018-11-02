import React, {Component} from 'react';
import AppContainer from "../shared/AppContainer";

export default class Impressum extends Component {
    render() {
        return (
            <AppContainer>
                <div className="app-width container">
                    <div className="row top-space">
                        <h2>Impressum</h2>
                        <p className="description">
                            Es gilt das
                            <a href="https://tu-dresden.de/impressum" target="_blank" rel="noopener noreferrer">
                                Impressum der TU Dresden</a> mit folgenden Abweichungen:
                        </p>

                        <p className="description">
                            <b>Inhaltlich verantwortlich:</b><br/>
                            Dr. Catalin Stefan<br/>
                            Technische Universität Dresden<br/>
                            Junior Research Group INOWAS<br/>
                            01062 Dresden<br/>
                            Tel.: +49 3501 530044<br/>
                            Fax: +49 3501 530022<br/>
                            Email: catalin.stefan@tu-dresden.de<br/>
                        </p>

                        <p className="description">
                            <b>Technischer Betrieb:</b><br/>
                            Dipl.-Ing. Ralf Junghanns<br/>
                            Technische Universität Dresden<br/>
                            Junior Research Group INOWAS<br/>
                            01062 Dresden<br/>
                            Tel.: +49 3501 530039<br/>
                            Fax: +49 3501 530022<br/>
                            Email: ralf.junghanns@tu-dresden.de<br/>
                        </p>
                    </div>
                </div>
            </AppContainer>
        );
    }
}
